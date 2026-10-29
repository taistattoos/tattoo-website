'use client';

import SplitText from '@/components/animations/SplitText';
import { TRANSLATED_LABELS } from '@/lib/constants/testimonials';
import { LocaleEnum } from '@/types/enums';
import type { TestimonialItem } from '@/types/testimonials';
import { motion } from 'framer-motion';

interface TestimonialsPropsInterface {
  heading: string;
  items: TestimonialItem[];
  locale: LocaleEnum;
}

export default function Testimonials({ heading, items, locale }: TestimonialsPropsInterface) {
  if (items.length === 0) return null;

  const labels = TRANSLATED_LABELS[locale] ?? TRANSLATED_LABELS.en;

  return (
    <section id='testimonials' aria-labelledby='testimonials-title' className='wrapper py-24'>
      <SplitText
        as='h2'
        id='testimonials-title'
        text={heading}
        by='words'
        stagger={0.08}
        className='mb-16 block text-4xl leading-tight text-white md:text-5xl'
      />

      <div className='grid gap-6 sm:grid-cols-2 md:grid-cols-3'>
        {items.map((item, i) => (
          <motion.figure
            key={item.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className='flex flex-col rounded-lg border border-white/10 px-6 py-5'
          >
            <blockquote className='text-white/80'>&ldquo;{item.quote}&rdquo;</blockquote>

            {item.translatedFrom && (
              <span className='mt-4 w-fit rounded-full border border-white/15 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-white/50'>
                {labels.prefix} {labels.from[item.translatedFrom]}
              </span>
            )}

            <figcaption className='mt-auto pt-4 text-xs uppercase tracking-[0.15em] text-white/40'>
              {item.name} — {item.source}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}