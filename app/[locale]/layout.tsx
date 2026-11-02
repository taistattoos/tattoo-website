import Footer from '@/components/layout/footer/Footer';
import Navigation from '@/components/layout/navigation/Navigation';
import SmoothScroll from '@/components/providers/SmoothScroll';
import { LOCALES } from '@/lib/constants/shared';
import { getSite } from '@/lib/content/content';
import { LocaleEnum } from '@/types/enums';

export function generateStaticParams() {
  return LOCALES.map(({ code }) => ({ locale: code }));
}

export const dynamicParams = false;

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
      <Navigation locale={locale} shopEnabled={getSite().shop_enabled} />
      {children}
      <Footer locale={LOCALE} />
    </SmoothScroll>
  );
}

