import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SplitText from '@/components/animations/SplitText';
import { NAV_LABELS } from '@/lib/constants/shared';
import { getSite } from '@/lib/content/content';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!getSite().shop_enabled) return {};

  const { locale } = await params;
  const labels = NAV_LABELS[locale] ?? NAV_LABELS.en;

  return {
    title: labels.shop,
    alternates: { canonical: `/${locale}/shop` },
  };
}

export default async function ShopPage({ params }: Props) {
  if (!getSite().shop_enabled) notFound();

  const { locale } = await params;
  const labels = NAV_LABELS[locale] ?? NAV_LABELS.en;

  return (
    <main className='wrapper pb-24 pt-32 min-h-dvh'>
      <SplitText
        as='h1'
        text={labels.shop}
        by='words'
        stagger={0.08}
        trigger='mount'
        className='mb-12 block text-4xl leading-tight text-white md:text-5xl'
      />
    </main>
  );
}