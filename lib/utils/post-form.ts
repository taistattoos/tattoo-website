import { FORM_ERROR_MESSAGES, FORM_TIMEOUT_MS, type FormErrorCode } from '@/lib/constants/form-errors';
import { LocaleEnum } from '@/types/enums';

export type PostFormResult = { ok: true } | { ok: false; code: FormErrorCode };

// Maps the API's response codes (app/api/*/route.ts) to what the visitor is told.
function toErrorCode(apiCode: unknown, status: number): FormErrorCode {
  switch (apiCode) {
    case 'rate':
      return 'rate';
    case 'captcha':
      return 'captcha';
    case 'invalid':
    case 'consent':
    case 'size':
      return 'invalid';
    case 'unavailable':
      return 'unavailable';
  }
  if (status === 429) return 'rate';
  if (status === 503 || status === 504) return 'unavailable';
  return 'generic';
}

export async function postForm(url: string, payload: unknown): Promise<PostFormResult> {
  // AbortController + setTimeout instead of AbortSignal.timeout(), which Safari only has since 16.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FORM_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (response.ok) return { ok: true };

    const data = (await response.json().catch(() => null)) as { code?: unknown } | null;
    return { ok: false, code: toErrorCode(data?.code, response.status) };
  } catch {
    return { ok: false, code: controller.signal.aborted ? 'timeout' : 'generic' };
  } finally {
    clearTimeout(timer);
  }
}

export function getFormErrorMessage(code: FormErrorCode | null, locale: string, fallback: string): string {
  if (!code || code === 'generic') return fallback;
  const messages = FORM_ERROR_MESSAGES[locale as LocaleEnum] ?? FORM_ERROR_MESSAGES.en;
  return messages[code];
}
