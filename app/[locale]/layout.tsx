import Footer from '@/components/layout/footer/Footer';
import Navigation from '@/components/layout/navigation/Navigation';
import SmoothScroll from '@/components/providers/SmoothScroll';
import { LOCALES } from '@/lib/constants/shared';
import { LocaleEnum } from '@/types/enums';

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
  const LOCALE = locale as LocaleEnum;

  return (
    <SmoothScroll>
      <Navigation locale={LOCALE} />
      {children}
      <Footer locale={LOCALE} />
    </SmoothScroll>
  );
}
