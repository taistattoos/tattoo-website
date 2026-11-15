'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import Eyebrow from '@/components/ui/Eyebrow';
import { DESKTOP_QUERY, useMediaQuery } from '@/hooks/useMediaQuery';
import type { AboutSpecialty } from '@/types/about';

// Every card sits in a pinned slot of the same height. Equal slots with no margins are what let all
// cards stay pinned until the last one lands (a margin on a sticky element counts against its room).
const SLOT_VH = 80;
// Inside its slot, each card starts this far down, plus a step per card so the stack's edges stay visible.
const STICKY_TOP_REM = 7;
const STACK_STEP_REM = 1.75;
// How much each card shrinks for every card that lands on top of it.
const SHRINK_PER_CARD = 0.05;

interface CardProps {
  item: AboutSpecialty;
  index: number;
  total: number;
  progress: MotionValue<number>;
  stacking: boolean;
}

function SpecialtyCard({ item, index, total, progress, stacking }: CardProps) {
  const cardsAbove = total - 1 - index;
  // Progress 0 = first card pinned, 1 = last card landed; card i lands at i / (total - 1).
  const start = total > 1 ? index / (total - 1) : 0;

  const scale = useTransform(progress, [start, 1], [1, 1 - cardsAbove * SHRINK_PER_CARD]);
  const dim = useTransform(progress, [start, 1], [0, cardsAbove * 0.18]);

  return (
    <li
      className={stacking ? 'sticky top-0' : undefined}
      style={
        stacking
          ? { height: `${SLOT_VH}svh`, paddingTop: `${STICKY_TOP_REM + index * STACK_STEP_REM}rem` }
          : undefined
      }
    >
      <motion.article
        style={stacking ? { scale } : undefined}
        className='relative origin-top overflow-hidden rounded-lg border border-white/10 bg-(--color-ink-deep) p-8 md:p-12 lg:min-h-[22rem]'
      >
        <div className='grid gap-6 md:grid-cols-[6rem_1fr] md:gap-10'>
          <span aria-hidden='true' className='text-4xl text-white/20 md:text-5xl'>
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <h3 className='mb-4 text-2xl uppercase tracking-[0.05em] text-white md:text-4xl'>{item.title}</h3>
            <p className='max-w-xl text-base leading-relaxed text-white/60'>{item.text}</p>
          </div>
        </div>

        {/* Cards further back in the stack darken slightly. */}
        {stacking && (
          <motion.div aria-hidden='true' className='pointer-events-none absolute inset-0 bg-black' style={{ opacity: dim }} />
        )}
      </motion.article>
    </li>
  );
}

/**
 * "What I do" as full-width cards.
 * Desktop: each card pins and the next one slides up and stacks on top of it.
 * Phones and reduced motion: a simple list of cards.
 */
export default function AboutSpecialties({ items, heading }: { items: AboutSpecialty[]; heading: string }) {
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const stacking = isDesktop && !reduce;

  const { scrollYProgress } = useScroll({
    target: listRef,
    // Ends when the last slot reaches the top, i.e. the list's bottom is one slot below the top.
    offset: ['start start', `end ${SLOT_VH}%`],
  });

  if (items.length === 0) return null;

  return (
    <div className='wrapper mt-16'>
      <Eyebrow text={heading} className='mb-6' />
      <ol ref={listRef} className={stacking ? undefined : 'space-y-4'}>
        {items.map((item, index) => (
          <SpecialtyCard
            key={index}
            item={item}
            index={index}
            total={items.length}
            progress={scrollYProgress}
            stacking={stacking}
          />
        ))}
      </ol>
    </div>
  );
}
