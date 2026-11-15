import { NextRequest, NextResponse } from 'next/server';
import { LOCALES } from '@/lib/constants/shared';
import { DEFAULT_LOCALE } from '@/lib/seo';

const SUPPORTED = LOCALES.map(({ code }) => code) as string[];

/**
 * Picks the first supported language from the browser's preference list, honouring q-weights,
 * e.g. "de-DE,ru;q=0.9,en;q=0.8" → "ru". Falls back to English.
 */
function pickLocale(request: NextRequest): string {
  const preferences = (request.headers.get('accept-language') ?? '')
    .split(',')
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(';');
      const q = Number(params.find((param) => param.trim().startsWith('q='))?.trim().slice(2) ?? 1);
      return { lang: tag.split('-')[0].toLowerCase(), q: Number.isFinite(q) ? q : 0, index };
    })
    .filter(({ lang, q }) => lang && q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);

  return preferences.find(({ lang }) => SUPPORTED.includes(lang))?.lang ?? DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    const locale = pickLocale(request);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }
}

export const config = {
  matcher: '/',
};
