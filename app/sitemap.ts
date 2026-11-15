import type { MetadataRoute } from 'next';
import { LOCALES } from '@/lib/constants/shared';
import { getAbout, getGalleryItems, getSite } from '@/lib/content/content';
import { languageAlternates, localizedUrl, SITE_URL } from '@/lib/seo';
import { LocaleEnum } from '@/types/enums';

const absolute = (relative: string) => `${SITE_URL}${encodeURI(relative)}`;

export default function sitemap(): MetadataRoute.Sitemap {
  // Every gallery photo is listed, so Google Images finds them even when they sit behind "Load more".
  const galleryImages = getGalleryItems()
    .map((item) => item.image)
    .filter((image): image is string => Boolean(image))
    .map(absolute);

  const aboutImage = getAbout(LocaleEnum.EN).image;

  const pages: { path: string; priority: number; images?: string[] }[] = [
    { path: '', priority: 1 },
    { path: '/gallery', priority: 0.9, images: galleryImages },
    { path: '/about', priority: 0.7, images: aboutImage ? [absolute(aboutImage)] : undefined },
    { path: '/contact', priority: 0.8 },
    ...(getSite().shop_enabled ? [{ path: '/shop', priority: 0.5 }] : []),
    { path: '/privacy', priority: 0.1 },
  ];

  return pages.flatMap(({ path, priority, images }) => {
    const languages = Object.fromEntries(
      Object.entries(languageAlternates(path)).map(([lang, url]) => [lang, `${SITE_URL}${url}`]),
    );

    return LOCALES.map(({ code }) => ({
      url: `${SITE_URL}${localizedUrl(code, path)}`,
      lastModified: new Date(),
      priority,
      alternates: { languages },
      ...(images && images.length > 0 ? { images } : {}),
    }));
  });
}
