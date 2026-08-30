import { getHomeContent } from '@/lib/content/content';
import Hero from '@/components/layout/hero/Hero';
import { LocaleEnum } from '@/types/enums';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const LOCALE = locale as LocaleEnum;

  const data = getHomeContent();

  return (
    <main>
      <Hero
        eyebrow={data[`eyebrow_${LOCALE}`] || 'Tais — Tattoo Artist'}
        headline={
          data[`headline_${LOCALE}`] ||
          "Ink drawn like it's already under your skin."
        }
        subheadline={data[`subheadline_${LOCALE}`] || ''}
        ctaLabel={data[`cta_label_${LOCALE}`] || 'Start an inquiry'}
        ctaLink={data.cta_link || '#contact'}
      />
    </main>
  );
}