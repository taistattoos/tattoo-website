import Navigation from "@/components/layout/navigation/Navigation";


const LOCALES = ['en', 'sr', 'ru'];

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
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
    <>
      <Navigation locale={locale} />
      {children}
    </>
  );
}
