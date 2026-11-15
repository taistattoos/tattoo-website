import type { NextRequest } from 'next/server';

/**
 * The site's main address, e.g. https://tais-tattoos.netlify.app (or the custom domain once set).
 *
 * Netlify serves every deploy on extra addresses too (`<deploy-id>--<site>.netlify.app`), and requests
 * can arrive on those. The GitHub login only accepts the one callback URL registered in the OAuth app,
 * so login code must use this fixed address, never the incoming request's host.
 *
 * SITE_ORIGIN is filled in at build time from Netlify's `URL` variable (next.config.ts).
 * Locally it's empty, so the request's own origin is used.
 */
export function getSiteOrigin(request: NextRequest): string {
  const configured = process.env.SITE_ORIGIN;
  if (configured) {
    try {
      return new URL(configured).origin;
    } catch {
      console.error('site origin: SITE_ORIGIN is not a valid URL');
    }
  }
  return request.nextUrl.origin;
}
