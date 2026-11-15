import type { MetadataRoute } from 'next';
import { LOCALES } from '@/lib/constants/shared';
import { getSite } from '@/lib/content/content';
import { languageAlternates, localizedUrl, SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: '', priority: 1 },
    { path: '/gallery', priority: 0.9 },
    { path: '/about', priority: 0.7 },
    { path: '/contact', priority: 0.8 },
    ...(getSite().shop_enabled ? [{ path: '/shop', priority: 0.5 }] : []),
    { path: '/privacy', priority: 0.1 },
  ];

  const absolute = (relative: string) => `${SITE_URL}${relative}`;

  return pages.flatMap(({ path, priority }) => {
    const languages = Object.fromEntries(
      Object.entries(languageAlternates(path)).map(([lang, url]) => [lang, absolute(url)]),
    );

    return LOCALES.map(({ code }) => ({
      url: absolute(localizedUrl(code, path)),
      lastModified: new Date(),
      priority,
      alternates: { languages },
    }));
  });
}
