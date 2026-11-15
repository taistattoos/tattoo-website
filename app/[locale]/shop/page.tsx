import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { notFound } from 'next/navigation';
import SplitText from '@/components/animations/SplitText';
import ShopOrder from '@/components/layout/shop/ShopOrder';
import { getProducts, getShopOrder, getShopPage, getSite } from '@/lib/content/content';
import { LocaleEnum } from '@/types/enums';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!getSite().shop_enabled) return {};

  const { locale } = await params;
  const page = getShopPage(locale as LocaleEnum);

  return pageMetadata({ locale, path: '/shop', title: page.title, description: page.intro || undefined });
}

export default async function ShopPage({ params }: Props) {
  if (!getSite().shop_enabled) notFound();

  const { locale } = await params;
  const LOCALE = locale as LocaleEnum;
  const page = getShopPage(LOCALE);
  const order = getShopOrder(LOCALE);
  const products = getProducts(LOCALE);

  return (
    <main className='wrapper pb-24 pt-32'>
      <SplitText
        as='h1'
        text={page.title}
        by='words'
        stagger={0.08}
        trigger='mount'
        className='mb-6 block text-4xl leading-tight text-white md:text-5xl'
      />
      {page.intro && <p className='mb-12 max-w-xl text-white/70'>{page.intro}</p>}

      <ShopOrder products={products} locale={LOCALE} page={page} order={order} />
    </main>
  );
}