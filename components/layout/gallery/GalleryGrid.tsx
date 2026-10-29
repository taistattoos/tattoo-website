'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { GALLERY_LABELS } from '@/lib/constants/gallery';
import { GalleryGridProps } from '@/types/gallery';

export default function GalleryGrid({ items, locale, categories = [], showFilters = true }: GalleryGridProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const labels = GALLERY_LABELS[locale] ?? GALLERY_LABELS.en;

  const usedSlugs = new Set(items.flatMap((item) => item.category));
  const availableCategories = categories.filter((category) => usedSlugs.has(category.slug));

  const filteredItems = activeFilter ? items.filter((item) => item.category.includes(activeFilter)) : items;

  if (items.length === 0) {
    return (
      <div className='rounded-lg border border-dashed border-white/15 px-6 py-16 text-center'>
        <p className='text-xs uppercase tracking-[0.2em] text-white/35'>{labels.empty}</p>
      </div>
    );
  }

  return (
    <div>
      {showFilters && (
        <div className='mb-10 flex flex-wrap justify-center gap-2'>
          <button
            onClick={() => setActiveFilter(null)}
            className={`rounded-full border px-4 py-1.5 text-xs uppercase transition-colors ${
              activeFilter === null ? 'border-white text-white' : 'border-white/20 text-white/50 hover:border-white/40'
            }`}
          >
            {labels.all}
          </button>
          {availableCategories.map((category) => (
            <button
              key={category.slug}
              onClick={() => setActiveFilter(category.slug)}
              className={`rounded-full border px-4 py-1.5 text-xs uppercase transition-colors ${
                activeFilter === category.slug
                  ? 'border-white text-white'
                  : 'border-white/20 text-white/50 hover:border-white/40'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}

      <motion.div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4'>
        <AnimatePresence mode='popLayout' initial={false}>
          {filteredItems.map((item) => (
            <motion.div
              key={item.slug}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className='group relative aspect-square overflow-hidden bg-neutral-900'
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes='(max-width: 640px) 50vw, 33vw'
                className='object-cover grayscale transition-all duration-700 ease-out group-hover:scale-110 group-hover:grayscale-0'
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}