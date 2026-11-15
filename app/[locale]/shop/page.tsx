import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { notFound } from 'next/navigation';
import SplitText from '@/components/animations/SplitText';
import ShopOrder from '@/components/layout/shop/ShopOrder';
import { getProducts, getShopOrder, getShopPage, getSite } from '@/lib/content/content';
import { SELLER_LABELS } from '@/lib/constants/shop';
import { LocaleEnum } from '@/types/enums';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!getSite().shop_enabled) return {};

  const { locale } = await params;
  const page = getShopPage(locale as LocaleEnum);

  return pageMetadata({ locale, path: '/shop', title: page.title, description: page.intro || undefined });
}

export default async function ShopPage({ params }: Props) {
  const site = getSite();
  if (!site.shop_enabled) notFound();

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
        reveal='focus'
        className='mb-6 block text-4xl leading-tight text-white md:text-5xl'
      />
      {page.intro && <p className='mb-12 max-w-xl text-white/70'>{page.intro}</p>}

      <ShopOrder products={products} locale={LOCALE} page={page} order={order} />

      {site.seller && (
        <SellerInfo seller={site.seller} labels={SELLER_LABELS[LOCALE] ?? SELLER_LABELS.en} />
      )}
    </main>
  );
}
function SellerInfo({
  seller,
  labels,
}: {
  seller: NonNullable<ReturnType<typeof getSite>['seller']>;
  labels: (typeof SELLER_LABELS)[LocaleEnum];
}) {
  return (
    <section aria-labelledby='seller-title' className='mt-24 border-t border-white/10 pt-8 text-sm text-white/50'>
      <h2 id='seller-title' className='mb-4 text-xs uppercase tracking-[0.2em] text-white/40'>
        {labels.heading}
      </h2>
      <dl className='grid gap-x-8 gap-y-2 sm:grid-cols-[auto_1fr]'>
        <dt className='sr-only'>{labels.heading}</dt>
        <dd className='text-white/70 sm:col-span-2'>{seller.name}</dd>
        <dt>{labels.address}</dt>
        <dd className='text-white/70'>{seller.address}</dd>
        <dt>{labels.mb}</dt>
        <dd className='text-white/70'>{seller.mb}</dd>
        <dt>{labels.pib}</dt>
        <dd className='text-white/70'>{seller.pib}</dd>
      </dl>
    </section>
  );
}
