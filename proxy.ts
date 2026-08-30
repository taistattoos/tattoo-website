import { NextRequest, NextResponse } from 'next/server';

const LOCALES = ['en', 'sr', 'ru'];
const DEFAULT_LOCALE = 'en';

function pickLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language') || '';
  const preferred = acceptLanguage.split(',')[0]?.split('-')[0];
  return LOCALES.includes(preferred) ? preferred : DEFAULT_LOCALE;
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