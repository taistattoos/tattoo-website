import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import Footer from '@/components/layout/footer/Footer';
import Navigation from '@/components/layout/navigation/Navigation';
import SmoothScroll from '@/components/providers/SmoothScroll';
import { LOCALES } from '@/lib/constants/shared';
import { getSite } from '@/lib/content/content';
import { ALLOW_INDEXING, HTML_LANG, SITE_NAME, SITE_URL } from '@/lib/seo';
import { LocaleEnum } from '@/types/enums';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  applicationName: SITE_NAME,
  robots: ALLOW_INDEXING
    ? { index: true, follow: true, googleBot: { 'max-image-preview': 'large' } }
    : { index: false, follow: false },
  icons: { icon: getSite().favicon || '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#0b0b0b',
};

export function generateStaticParams() {
  return LOCALES.map(({ code }) => ({ locale: code }));
}

export const dynamicParams = false;

// This is the root layout: it lives under [locale] so <html lang> matches the page language.
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const LOCALE = locale as LocaleEnum;

  return (
    <html lang={HTML_LANG[LOCALE] ?? 'en'}>
      <body className={`${inter.variable} antialiased`}>
        <SmoothScroll>
          <Navigation locale={locale} shopEnabled={getSite().shop_enabled} />
          {children}
          <Footer locale={LOCALE} />
        </SmoothScroll>
      </body>
    </html>
  );
}
