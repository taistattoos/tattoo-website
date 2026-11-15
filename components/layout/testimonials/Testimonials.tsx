'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import SplitText from '@/components/animations/SplitText';
import {
  TESTIMONIALS_INITIAL_COUNT,
  TESTIMONIALS_TOGGLE_LABELS,
  TRANSLATED_LABELS,
} from '@/lib/constants/testimonials';
import { BUTTON_CLASSES } from '@/lib/constants/ui';
import { LocaleEnum } from '@/types/enums';
import type { TestimonialItem } from '@/types/testimonials';

interface TestimonialsPropsInterface {
  heading: string;
  items: TestimonialItem[];
  locale: LocaleEnum;
}

const GRID_CLASS = 'grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
const EASE = [0.22, 1, 0.36, 1] as const;

function TestimonialCard({ item, locale, index }: { item: TestimonialItem; locale: LocaleEnum; index: number }) {
  const labels = TRANSLATED_LABELS[locale] ?? TRANSLATED_LABELS.en;

  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: (index % 3) * 0.1, duration: 0.5, ease: EASE }}
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
  );
}

export default function Testimonials({ heading, items, locale }: TestimonialsPropsInterface) {
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  if (items.length === 0) return null;

  const toggleLabels = TESTIMONIALS_TOGGLE_LABELS[locale] ?? TESTIMONIALS_TOGGLE_LABELS.en;
  const visible = items.slice(0, TESTIMONIALS_INITIAL_COUNT);
  const rest = items.slice(TESTIMONIALS_INITIAL_COUNT);

  function toggle() {
    // When collapsing, glide back to the top of the section so the page doesn't seem to jump.
    if (expanded && sectionRef.current) {
      if (lenis) lenis.scrollTo(sectionRef.current, { offset: -80, duration: 1 });
      else sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    setExpanded((value) => !value);
  }

  return (
    <section ref={sectionRef} id='testimonials' aria-labelledby='testimonials-title' className='wrapper py-24'>
      <SplitText
        as='h2'
        id='testimonials-title'
        text={heading}
        by='words'
        stagger={0.08}
        className='mb-16 block text-4xl leading-tight text-white md:text-5xl'
      />

      <div className={GRID_CLASS}>
        {visible.map((item, index) => (
          <TestimonialCard key={item.slug} item={item} locale={locale} index={index} />
        ))}
      </div>

      <AnimatePresence initial={false}>
        {expanded && rest.length > 0 && (
          <motion.div
            id='testimonials-more'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className='overflow-hidden'
          >
            <div className={`${GRID_CLASS} pt-6`}>
              {rest.map((item, index) => (
                <TestimonialCard key={item.slug} item={item} locale={locale} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {rest.length > 0 && (
        <div className='mt-12 text-center'>
          <button
            type='button'
            onClick={toggle}
            aria-expanded={expanded}
            aria-controls='testimonials-more'
            className={BUTTON_CLASSES}
          >
            {expanded ? toggleLabels.less : `${toggleLabels.more} (${items.length})`}
            <svg
              width='10'
              height='6'
              viewBox='0 0 10 6'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.5'
              aria-hidden='true'
              className={`transition-transform duration-500 ${expanded ? 'rotate-180' : ''}`}
            >
              <path d='M1 1l4 4 4-4' />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
