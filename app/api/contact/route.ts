import { NextResponse, type NextRequest } from 'next/server';
import { CONTACT_MAX_BODY_BYTES, CONTACT_MIN_FILL_MS } from '@/lib/constants/contact-api';
import { getContactForm } from '@/lib/content/content';
import { buildOwnerEmail, getAnswerLines } from '@/lib/server/contact-email';
import { validateSubmission } from '@/lib/server/contact-validation';
import { sendOwnerEmail } from '@/lib/server/mailer';
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
  if (!isSameOrigin(request)) return respond(403, 'origin');

  const raw = await request.text();
  if (raw.length > CONTACT_MAX_BODY_BYTES) return respond(413, 'size');

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return respond(400, 'invalid');
    body = parsed as Record<string, unknown>;
  } catch {
    return respond(400, 'invalid');
  }

  const tooFast = typeof body.elapsedMs !== 'number' || body.elapsedMs < CONTACT_MIN_FILL_MS;
  if (body.website || tooFast) return respond(200, 'ok');

  const content = getContactForm(LocaleEnum.EN);
  const result = validateSubmission(body, content);
  if (!result.ok) return respond(400, 'invalid');

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const human = await verifyTurnstile(body.turnstileToken, ip);
  if (!human) return respond(400, 'captcha');

  const locale = Object.values(LocaleEnum).includes(body.locale as LocaleEnum)
    ? (body.locale as LocaleEnum)
    : LocaleEnum.EN;

  try {
    const lines = getAnswerLines(content, result.data.answers);
    const email = buildOwnerEmail(result.data, lines, locale);
    await sendOwnerEmail({ ...email, replyTo: result.data.email });
  } catch (error) {
    const { code, responseCode, command } = error as { code?: string; responseCode?: number; command?: string };
    console.error('contact: sending failed', { code, responseCode, command });
    return respond(500, 'send');
  }

  return respond(200, 'ok');
}
