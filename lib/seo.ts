import type { Metadata } from 'next';
import { LOCALES } from '@/lib/constants/shared';
import { LocaleEnum } from '@/types/enums';

export const SITE_URL = 'https://taistattoos.com';
export const SITE_NAME = 'Tais Tattoos';
export const DEFAULT_LOCALE = LocaleEnum.EN;

// Social share image (1200×630). Must exist in /public — see SEO notes.
export const OG_IMAGE = { url: '/og-default.jpg', width: 1200, height: 630, alt: SITE_NAME };

/**
 * Search engines may index the site only when ALLOW_INDEXING=true.
 * Set it on the Vercel *Production* environment at launch; previews and local stay hidden.
 */
export const ALLOW_INDEXING = process.env.ALLOW_INDEXING === 'true';

// Serbian content is written in Latin script.
export const HTML_LANG: Record<LocaleEnum, string> = {
  en: 'en',
  sr: 'sr-Latn',
  ru: 'ru',
};

const OG_LOCALE: Record<LocaleEnum, string> = {
  en: 'en_US',
  sr: 'sr_RS',
  ru: 'ru_RU',
};

/** `path` is the part after the locale, e.g. '' for home or '/gallery'. */
export function localizedUrl(locale: string, path = ''): string {
  return `/${locale}${path}`;
}

export function languageAlternates(path = ''): Record<string, string> {
  return {
    ...Object.fromEntries(LOCALES.map(({ code }) => [code, localizedUrl(code, path)])),
    'x-default': localizedUrl(DEFAULT_LOCALE, path),
  };
}

interface PageMetadataInput {
  locale: string;
  path?: string;
  title: string;
  description?: string;
  /** Use the title as-is, without the "| Tais Tattoos" suffix. */
  absoluteTitle?: boolean;
}

/** Canonical, hreflang and Open Graph tags for one localized page. */
export function pageMetadata({ locale, path = '', title, description, absoluteTitle = false }: PageMetadataInput): Metadata {
  const ogLocale = OG_LOCALE[locale as LocaleEnum] ?? OG_LOCALE.en;
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: localizedUrl(locale, path),
      languages: languageAlternates(path),
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      url: localizedUrl(locale, path),
      locale: ogLocale,
      alternateLocale: Object.values(OG_LOCALE).filter((value) => value !== ogLocale),
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
