import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import SplitText from '@/components/animations/SplitText';
import FavoriteProject from '@/components/layout/gallery/FavoriteProject';
import GalleryGrid from '@/components/layout/gallery/GalleryGrid';
import { LOCALES } from '@/lib/constants/shared';
import { getCategories, getGalleryGridItems, getGalleryPage } from '@/lib/content/content';
import { LocaleEnum } from '@/types/enums';

export function generateStaticParams() {
  return LOCALES.map(({ code }) => ({ locale: code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = getGalleryPage(locale as LocaleEnum);

  return pageMetadata({ locale, path: '/gallery', title: page.title, description: page.intro });
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const LOCALE = locale as LocaleEnum;

  const page = getGalleryPage(LOCALE);
  const items = getGalleryGridItems(LOCALE);

  const favorite = items.find((item) => item.slug === page.favoriteSlug);
  const rest = favorite ? items.filter((item) => item.slug !== favorite.slug) : items;

  return (
    <main className='wrapper pb-24 pt-32'>
      <SplitText
        as='h1'
        text={page.title}
        trigger='mount'
        reveal='focus'
        className='mb-6 block text-4xl text-white md:text-5xl'
      />
      {page.intro && <p className='mb-12 max-w-2xl text-white/60'>{page.intro}</p>}

      {favorite && <FavoriteProject item={favorite} />}

      <GalleryGrid items={rest} locale={LOCALE} categories={getCategories(LOCALE)} />
    </main>
  );
}