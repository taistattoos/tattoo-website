'use client';

import SplitText from '@/components/animations/SplitText';
import { motion } from 'framer-motion';

type Testimonial = {
  slug: string;
  client_name?: string;
  quote?: string;
  rating?: number;
  source?: string;
};

const HEADING = {
  en: 'What Clients Say',
  sr: 'Šta Klijenti Kažu',
  ru: 'Отзывы Клиентов',
} as const;

export default function Testimonials({ items, locale }: { items: Testimonial[]; locale: string }) {
  if (items.length === 0) return null;

  const heading = HEADING[locale as keyof typeof HEADING] ?? HEADING.en;

  return (
    <section id='testimonials' className='wrapper py-24'>
      <SplitText
        as='h2'
        id='booking-title'
        text={heading}
        by='words'
        stagger={0.08}
        className='mb-16 block text-4xl leading-tight text-white md:text-5xl'
      />

      <div className='grid gap-6 md:grid-cols-3 sm:grid-cols-2'>
        {items.map((item, i) => (
          <motion.figure
            key={item.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className='rounded-lg grid grid-rows-1 border border-white/10 px-6 py-5'
          >
            <blockquote className='text-white/80'>&ldquo;{item.quote}&rdquo;</blockquote>
            <figcaption className='mt-4 text-xs uppercase tracking-[0.15em] text-white/40'>
              {item.client_name} — {item.source}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
