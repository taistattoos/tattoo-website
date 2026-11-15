'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import BookingStep from '@/components/layout/booking/BookingStep';
import type { BookingStep as BookingStepType } from '@/types/booking';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Image to show for the active step: its own, else the nearest earlier one, else the first available. */
function imageIndexFor(steps: BookingStepType[], active: number): number {
  for (let index = active; index >= 0; index--) {
    if (steps[index].image) return index;
  }
  return steps.findIndex((step) => step.image);
}

export default function BookingSteps({ steps }: { steps: BookingStepType[] }) {
  const reduce = useReducedMotion();
  const [reached, setReached] = useState<boolean[]>(() => steps.map(() => false));

  const hasImages = steps.some((step) => step.image);
  const active = Math.max(0, reached.lastIndexOf(true));
  const shownImage = imageIndexFor(steps, active);

  function handleActiveChange(index: number, isActive: boolean) {
    setReached((current) => current.map((value, i) => (i === index ? isActive : value)));
  }

  const list = (
    <ol className='max-w-2xl'>
      {steps.map((step, index) => (
        <BookingStep
          key={index}
          number={index + 1}
          title={step.title}
          text={step.text}
          isLast={index === steps.length - 1}
          image={step.image}
          imageAlt={step.imageAlt}
          onActiveChange={hasImages ? (isActive) => handleActiveChange(index, isActive) : undefined}
        />
      ))}
    </ol>
  );

  // No images in the CMS: keep the original single-column layout.
  if (!hasImages) return list;

  return (
    <div className='grid items-start gap-16 lg:grid-cols-2'>
      {list}

      {/* Desktop only: a sticky picture that crossfades to match the step being read. */}
      <div className='sticky top-28 hidden lg:block'>
        <div className='relative aspect-4/5 overflow-hidden rounded-lg bg-neutral-900'>
          {steps.map((step, index) =>
            step.image ? (
              <motion.div
                key={index}
                className='absolute inset-0'
                initial={false}
                animate={{ opacity: index === shownImage ? 1 : 0, scale: index === shownImage ? 1 : 1.04 }}
                transition={reduce ? { duration: 0 } : { duration: 0.8, ease: EASE }}
                aria-hidden={index !== shownImage}
              >
                <Image src={step.image} alt={step.imageAlt} fill sizes='(min-width: 1024px) 45vw, 1px' className='object-cover' />
              </motion.div>
            ) : null,
          )}
        </div>

        <p className='mt-4 text-xs uppercase tracking-[0.2em] text-white/40'>
          {String(active + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')} — {steps[active].title}
        </p>
      </div>
    </div>
  );
}
