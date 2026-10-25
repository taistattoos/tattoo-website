import Navigation from '@/components/layout/navigation/Navigation';
import SmoothScroll from '@/components/providers/SmoothScroll';
import { LOCALES } from '@/lib/constants/shared';

export function generateStaticParams() {
  return LOCALES.map(({ code }) => ({ locale: code }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <SmoothScroll>
      <Navigation locale={locale} />
      {children}
    </SmoothScroll>
  );
}
