import type { Metadata } from 'next';
import SplitText from '@/components/animations/SplitText';
import ContactForm from '@/components/layout/contact/contact-form/ContactForm';
import { LOCALES } from '@/lib/constants/shared';
import { LocaleEnum } from '@/types/enums';

const PAGE_META: Record<LocaleEnum, { title: string; description: string }> = {
  en: {
    title: 'Contact',
    description:
      'Book a consultation with Tais for a Japanese-style tattoo, animal mascot, pet portrait or cover-up in Belgrade, Novi Sad or Zrenjanin.',
  },
  sr: {
    title: 'Kontakt',
    description:
      'Zakažite konsultaciju kod Taise za tetovažu u japanskom stilu, životinjsku maskotu, portret ljubimca ili cover-up u Beogradu, Novom Sadu ili Zrenjaninu.',
  },
  ru: {
    title: 'Контакты',
    description:
      'Запишитесь на консультацию к Таис: японский стиль, маскоты, портреты питомцев и перекрытие старых татуировок в Белграде, Нови-Саде и Зренянине.',
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
    alternates: { canonical: `/${locale}/contact` },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const LOCALE = locale as LocaleEnum;
  const meta = PAGE_META[LOCALE] ?? PAGE_META.en;

  return (
    <main className='wrapper pb-24 pt-32'>
      <SplitText
        as='h1'
        text={meta.title}
        trigger='mount'
        className='mb-12 block text-4xl text-white md:text-5xl'
      />
      <ContactForm locale={LOCALE} />
    </main>
  );
}