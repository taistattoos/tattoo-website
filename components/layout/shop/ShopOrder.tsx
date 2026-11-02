'use client';

import { useMemo, useState } from 'react';
import OrderForm from '@/components/layout/shop/OrderForm';
import ProductCard from '@/components/layout/shop/ProductCard';
import { formatPrice } from '@/lib/utils/price';
import type { LocaleEnum } from '@/types/enums';
import type { OrderItem, ProductItem, ShopOrderContent, ShopPageContent } from '@/types/shop';

interface ShopOrderProps {
  products: ProductItem[];
  locale: LocaleEnum;
  page: ShopPageContent;
  order: ShopOrderContent;
}

export default function ShopOrder({ products, locale, page, order }: ShopOrderProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const totals = useMemo(() => {
    return products.reduce(
      (sum, product) => {
        const quantity = quantities[product.slug] ?? 0;
        return {
          count: sum.count + quantity,
          rsd: sum.rsd + quantity * product.priceRsd,
          eur: sum.eur + quantity * product.priceEur,
        };
      },
      { count: 0, rsd: 0, eur: 0 },
    );
  }, [products, quantities]);

  const items = useMemo<OrderItem[]>(
    () =>
      products
        .filter((product) => product.available && (quantities[product.slug] ?? 0) > 0)
        .map((product) => ({ slug: product.slug, quantity: quantities[product.slug] })),
    [products, quantities],
  );

  if (products.length === 0) {
    return <p className='text-white/60'>{page.empty}</p>;
  }

  return (
    <>
      <ul className='grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4'>
        {products.map((product) => (
          <ProductCard
            key={product.slug}
            product={product}
            locale={locale}
            soldOutLabel={page.soldOut}
            quantityLabel={order.quantity}
            quantity={quantities[product.slug] ?? 0}
            onQuantityChange={(quantity) => setQuantities((previous) => ({ ...previous, [product.slug]: quantity }))}
          />
        ))}
      </ul>

      {totals.count > 0 && (
        <div className='mt-12 flex items-baseline justify-between border-t border-white/10 pt-6 text-white'>
          <span className='text-sm uppercase tracking-[0.15em] text-white/60'>{order.total}</span>
          <span className='text-xl'>
            {formatPrice(totals.rsd, 'RSD', locale)}
            <span className='ml-2 text-sm text-white/40'>({formatPrice(totals.eur, 'EUR', locale)})</span>
          </span>
        </div>
      )}

      <OrderForm content={order} items={items} onSuccess={() => setQuantities({})} />
    </>
  );
}