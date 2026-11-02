'use client';

import Image from 'next/image';
import { SHOP_MAX_QUANTITY } from '@/lib/constants/shop';
import { formatPrice } from '@/lib/utils/price';
import type { LocaleEnum } from '@/types/enums';
import type { ProductItem } from '@/types/shop';

interface ProductCardProps {
  product: ProductItem;
  locale: LocaleEnum;
  soldOutLabel: string;
  quantityLabel: string;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const stepperButton =
  'flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30';

export default function ProductCard({
  product,
  locale,
  soldOutLabel,
  quantityLabel,
  quantity,
  onQuantityChange,
}: ProductCardProps) {
  return (
    <li className='group'>
      <div className='relative aspect-square overflow-hidden bg-neutral-900'>
        {product.image && (
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            sizes='(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw'
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
              product.available ? '' : 'opacity-40 grayscale'
            }`}
          />
        )}
        {!product.available && (
          <span className='absolute left-3 top-3 border border-white/30 bg-black/70 px-3 py-1 text-xs uppercase tracking-[0.15em] text-white'>
            {soldOutLabel}
          </span>
        )}
      </div>

      <h2 className='mt-4 text-lg text-white'>{product.name}</h2>
      {product.description && (
        <p className='mt-1 text-sm leading-relaxed text-white/60'>{product.description}</p>
      )}
      <p className='mt-3 text-white'>
        {formatPrice(product.priceRsd, 'RSD', locale)}
        <span className='ml-2 text-sm text-white/40'>({formatPrice(product.priceEur, 'EUR', locale)})</span>
      </p>

      {product.available && (
        <div className='mt-4 flex items-center gap-3' role='group' aria-label={`${quantityLabel}: ${product.name}`}>
          <button
            type='button'
            onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
            disabled={quantity === 0}
            aria-label={`${product.name} -`}
            className={stepperButton}
          >
            −
          </button>
          <span className='w-6 text-center text-white' aria-live='polite'>
            {quantity}
          </span>
          <button
            type='button'
            onClick={() => onQuantityChange(Math.min(SHOP_MAX_QUANTITY, quantity + 1))}
            disabled={quantity >= SHOP_MAX_QUANTITY}
            aria-label={`${product.name} +`}
            className={stepperButton}
          >
            +
          </button>
        </div>
      )}
    </li>
  );
}