'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type GalleryGridItem = {
  slug: string;
  title: string;
  image: string;
  category: string[];
};

const CATEGORY_LABELS: Record<string, string> = {
  'black-grey': 'Black & Grey',
  color: 'Color',
  japanese: 'Japanese',
  illustrative: 'Illustrative',
  whipshading: 'Whipshading',
};

export default function GalleryGrid({ items }: { items: GalleryGridItem[] }) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Only show filter pills for categories that actually have items —
  // no point offering a filter that would just show an empty grid.
  const availableCategories = Array.from(
    new Set(items.flatMap((item) => item.category))
  );

  const filteredItems = activeFilter
    ? items.filter((item) => item.category.includes(activeFilter))
    : items;

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-white/15 px-6 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-white/35">
          No gallery items yet — add some in /admin
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter pills */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setActiveFilter(null)}
          className={`rounded-full border px-4 py-1.5 text-xs uppercase transition-colors ${
            activeFilter === null
              ? 'border-white text-white'
              : 'border-white/20 text-white/50 hover:border-white/40'
          }`}
        >
          All
        </button>
        {availableCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`rounded-full border px-4 py-1.5 text-xs uppercase transition-colors ${
              activeFilter === cat
                ? 'border-white text-white'
                : 'border-white/20 text-white/50 hover:border-white/40'
            }`}
          >
            {CATEGORY_LABELS[cat] ?? cat}
          </button>
        ))}
      </div>

      {/* Grid — AnimatePresence handles items entering/exiting as the
          filter changes; `layout` on each item makes the remaining ones
          smoothly slide into their new spot instead of snapping. */}
      <motion.div
        layout
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              key={item.slug}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="group relative aspect-square overflow-hidden bg-neutral-900"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover grayscale transition-all duration-700 ease-out group-hover:scale-110 group-hover:grayscale-0"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
