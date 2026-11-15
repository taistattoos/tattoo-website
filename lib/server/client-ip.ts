import type { NextRequest } from 'next/server';

/**
 * The visitor's IP address, for rate limiting and Turnstile.
 * Netlify sets `x-nf-client-connection-ip` from the real connection, so a visitor can't fake it.
 * `x-forwarded-for` can carry client-supplied values on some hosts, so it's only a fallback (local dev).
 */
export function getClientIp(request: NextRequest): string | undefined {
  const netlify = request.headers.get('x-nf-client-connection-ip')?.trim();
  if (netlify) return netlify;

  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined;
}
