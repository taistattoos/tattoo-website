import { NextResponse, type NextRequest } from 'next/server';
import { CONTACT_MAX_BODY_BYTES, CONTACT_MIN_FILL_MS } from '@/lib/constants/contact-api';
import { getContactForm } from '@/lib/content/content';
import { buildOwnerEmail, getAnswerLines } from '@/lib/server/contact-email';
import { validateSubmission } from '@/lib/server/contact-validation';
import { sendOwnerEmail } from '@/lib/server/mailer';
import { checkRateLimit, type RateLimitResult } from '@/lib/server/rate-limit';
import { getClientIp } from '@/lib/server/client-ip';
import { readJsonBody } from '@/lib/server/read-json-body';
import { verifyTurnstile } from '@/lib/server/turnstile';
import { LocaleEnum } from '@/types/enums';

export const runtime = 'nodejs';

const respond = (status: number, code: string) => NextResponse.json({ ok: status === 200, code }, { status });

// Refuses the request when a rate limit says no; returns null to continue.
function refuseIfLimited(result: RateLimitResult) {
  if (result === 'limited') return respond(429, 'rate');
  if (result === 'unavailable') return respond(503, 'unavailable');
  return null;
}

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

  const ip = getClientIp(request);
  const ipLimit = refuseIfLimited(await checkRateLimit('contactIp', ip ?? 'unknown'));
  if (ipLimit) return ipLimit;

  const parsed = await readJsonBody(request, CONTACT_MAX_BODY_BYTES);
  if (!parsed.ok) return respond(parsed.status, parsed.code);
  const body = parsed.body;

  const tooFast = typeof body.elapsedMs !== 'number' || body.elapsedMs < CONTACT_MIN_FILL_MS;
  if (body.website || tooFast) return respond(200, 'ok');

  if (body.consent !== true) return respond(400, 'consent');

  const content = getContactForm(LocaleEnum.EN);
  const result = validateSubmission(body, content);
  if (!result.ok) return respond(400, 'invalid');

  const human = await verifyTurnstile(body.turnstileToken, ip);
  if (!human) return respond(400, 'captcha');

  const globalLimit = refuseIfLimited(await checkRateLimit('contactGlobal', 'all'));
  if (globalLimit) return globalLimit;

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