import type { Metadata } from 'next';
import About from '@/components/layout/about/About';
import { LOCALES } from '@/lib/constants/shared';
import { LocaleEnum } from '@/types/enums';

const PAGE_META: Record<LocaleEnum, { title: string; description: string }> = {
  en: {
    title: 'About',
    description:
      'Meet Tais, a tattoo artist in Belgrade, Novi Sad and Zrenjanin specialising in Japanese-style tattoos, animal mascots and custom pet portraits.',
  },
  sr: {
    title: 'O meni',
    description:
      'Upoznajte Taisu, tattoo umetnicu iz Beograda, Novog Sada i Zrenjanina, specijalizovanu za tetovaže u japanskom stilu, životinjske maskote i portrete ljubimaca.',
  },
  ru: {
    title: 'Обо мне',
    description:
      'Познакомьтесь с Таис, тату-мастером из Белграда, Нови-Сада и Зренянина: японский стиль, анималистичные маскоты и портреты питомцев.',
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
    alternates: { canonical: `/${locale}/about` },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const LOCALE = locale as LocaleEnum;

  return (
    <main className='pt-24'>
      <About locale={LOCALE} />
    </main>
  );
}