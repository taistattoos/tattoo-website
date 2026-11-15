'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { GALLERY_LABELS, GALLERY_PAGE_SIZE } from '@/lib/constants/gallery';
import { BUTTON_CLASSES, PILL_CLASSES } from '@/lib/constants/ui';
import { GalleryGridProps } from '@/types/gallery';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function GalleryGrid({ items, locale, categories = [], showFilters = true }: GalleryGridProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(GALLERY_PAGE_SIZE);
  // Where the last "Load more" started, so only the new photos get a staggered entrance.
  const [batchStart, setBatchStart] = useState(0);
  const reduce = useReducedMotion();

  const labels = GALLERY_LABELS[locale] ?? GALLERY_LABELS.en;

  const countFor = (slug: string) => items.filter((item) => item.category.includes(slug)).length;
  const availableCategories = categories
    .map((category) => ({ ...category, count: countFor(category.slug) }))
    .filter((category) => category.count > 0);

  const filteredItems = activeFilter ? items.filter((item) => item.category.includes(activeFilter)) : items;
  const shownItems = filteredItems.slice(0, visibleCount);
  const hasMore = filteredItems.length > shownItems.length;

  function selectFilter(slug: string | null) {
    setActiveFilter(slug);
    setVisibleCount(GALLERY_PAGE_SIZE);
    setBatchStart(0);
  }

  function loadMore() {
    setBatchStart(visibleCount);
    setVisibleCount((count) => count + GALLERY_PAGE_SIZE);
  }

  if (items.length === 0) {
    return (
      <div className='rounded-lg border border-dashed border-white/15 px-6 py-16 text-center'>
        <p className='text-xs uppercase tracking-[0.2em] text-white/35'>{labels.empty}</p>
      </div>
    );
  }

  const pills = [
    { slug: null, label: labels.all, count: items.length },
    ...availableCategories.map(({ slug, label, count }) => ({ slug, label, count })),
  ];

  return (
    <div>
      {showFilters && availableCategories.length > 0 && (
        <div className='mb-10 flex flex-wrap justify-center gap-2'>
          {pills.map((pill) => (
            <button
              key={pill.slug ?? 'all'}
              type='button'
              onClick={() => selectFilter(pill.slug)}
              aria-pressed={activeFilter === pill.slug}
              className={PILL_CLASSES}
            >
              {pill.label}
              <span className='ml-1.5 opacity-50'>{pill.count}</span>
            </button>
          ))}
        </div>
      )}

      <div className='grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4 md:grid-cols-3'>
        <AnimatePresence mode='popLayout' initial={false}>
          {shownItems.map((item, index) => {
            const isNew = index >= batchStart;
            const delay = isNew && !reduce ? Math.min(index - batchStart, 11) * 0.05 : 0;

            return (
              <motion.div
                key={item.slug}
                layout={!reduce}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: EASE, delay }}
                className='group relative aspect-square overflow-hidden bg-neutral-900'
              >
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes='(max-width: 479px) 100vw, (max-width: 767px) 50vw, 33vw'
                  className='object-cover grayscale transition-all duration-700 ease-out group-hover:scale-110 group-hover:grayscale-0'
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredItems.length > GALLERY_PAGE_SIZE && (
        <div className='mt-12 flex flex-col items-center gap-5'>
          <p className='text-xs uppercase tracking-[0.2em] text-white/40' aria-live='polite'>
            {labels.showing
              .replace('{shown}', String(shownItems.length))
              .replace('{total}', String(filteredItems.length))}
          </p>
          {hasMore && (
            <button type='button' onClick={loadMore} className={BUTTON_CLASSES}>
              {labels.loadMore}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
