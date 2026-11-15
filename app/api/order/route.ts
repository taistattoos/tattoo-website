import { NextResponse, type NextRequest } from 'next/server';
import { ORDER_MAX_BODY_BYTES, ORDER_MIN_FILL_MS } from '@/lib/constants/shop';
import { getProducts, getShopOrder, getSite } from '@/lib/content/content';
import { sendCustomerEmail, sendOwnerEmail } from '@/lib/server/mailer';
import { buildCustomerOrderEmail, buildOwnerOrderEmail } from '@/lib/server/order-email';
import { validateOrder } from '@/lib/server/order-validation';
import { isRateLimited } from '@/lib/server/rate-limit';
import { verifyTurnstile } from '@/lib/server/turnstile';
import { LocaleEnum } from '@/types/enums';

export const runtime = 'nodejs';

const respond = (status: number, code: string) => NextResponse.json({ ok: status === 200, code }, { status });

function isSameOrigin(request: NextRequest): boolean {
  try {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    return Boolean(origin && host && new URL(origin).host === host);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!getSite().shop_enabled) return respond(404, 'closed');
  if (!isSameOrigin(request)) return respond(403, 'origin');

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (await isRateLimited('orderIp', ip ?? 'unknown')) return respond(429, 'rate');

  const raw = await request.text();
  if (Buffer.byteLength(raw, 'utf-8') > ORDER_MAX_BODY_BYTES) return respond(413, 'size');

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return respond(400, 'invalid');
    body = parsed as Record<string, unknown>;
  } catch {
    return respond(400, 'invalid');
  }

  const tooFast = typeof body.elapsedMs !== 'number' || body.elapsedMs < ORDER_MIN_FILL_MS;
  if (body.trap || tooFast) return respond(200, 'ok');

  if (body.consent !== true) return respond(400, 'consent');

  const result = validateOrder(body, getProducts(LocaleEnum.EN));
  if (!result.ok) return respond(400, 'invalid');

  const human = await verifyTurnstile(body.turnstileToken, ip);
  if (!human) return respond(400, 'captcha');

  // Only requests that passed every check use up the per-recipient and global quotas.
  const order = result.data;
  if (await isRateLimited('orderRecipient', order.customer.email.toLowerCase())) return respond(429, 'rate');
  if (await isRateLimited('orderGlobal', 'all')) return respond(429, 'rate');

  const locale = Object.values(LocaleEnum).includes(body.locale as LocaleEnum)
    ? (body.locale as LocaleEnum)
    : LocaleEnum.EN;
  const names = new Map(getProducts(locale).map((product) => [product.slug, product.name]));

  try {
    await sendOwnerEmail({ ...buildOwnerOrderEmail(order, locale, names), replyTo: order.customer.email });
  } catch (error) {
    const { code, responseCode, command } = error as { code?: string; responseCode?: number; command?: string };
    console.error('order: sending failed', { code, responseCode, command });
    return respond(500, 'send');
  }

  // The order is already with Tais; a failed confirmation must not fail it.
  try {
    await sendCustomerEmail({
      to: order.customer.email,
      ...buildCustomerOrderEmail(order, locale, names, getShopOrder(locale)),
    });
  } catch {
    console.error('order: confirmation failed');
  }

  return respond(200, 'ok');
}