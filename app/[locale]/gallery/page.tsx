import type { Metadata } from 'next';
import { getGalleryItems } from '@/lib/content/content';
import GalleryGrid from '@/components/layout/gallery/GalleryGrid';
import { LOCALES } from '@/lib/constants/shared';
import { LocaleEnum } from '@/types/enums';

const PAGE_META: Record<LocaleEnum, { title: string; description: string }> = {
  en: {
    title: 'Gallery',
    description: 'Browse black & grey and fine-line tattoo work by Tais.',
  },
  sr: {
    title: 'Galerija',
    description: 'Pregledajte black & grey i fine-line radove.',
  },
  ru: {
    title: 'Галерея',
    description: 'Просмотрите работы в стиле блэкворк и графика.',
  },
};

export function generateStaticParams() {
  return LOCALES.map(({ code }) => ({ locale: code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = PAGE_META[locale as LocaleEnum] ?? PAGE_META.en;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/${locale}/gallery` },
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
    const LOCALE = locale as LocaleEnum;

  const items = getGalleryItems().map((item) => ({
    slug: item.slug,
    title: item[`title_${LOCALE}`] || item.title_en || '',
    image: item.image || '',
    category: item.category || [],
  }));

  return (
    <main className="px-6 py-24 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-12 text-center text-3xl sm:text-4xl">
          {PAGE_META[LOCALE].title}
        </h1>
        <GalleryGrid items={items} />
      </div>
    </main>
  );
}
