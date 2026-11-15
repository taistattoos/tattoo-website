'use client';

import { useRef } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useTransform } from 'framer-motion';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { STEP_CIRCLE_OFFSET, STEP_LINE_OFFSET } from '@/lib/constants/scroll';

interface BookingStepPropsInterface {
  number: number;
  title: string;
  text: string;
  isLast: boolean;
  /** Fires when this step's circle passes half full, scrolling either way. */
  onActiveChange?: (active: boolean) => void;
}

export default function BookingStep({ number, title, text, isLast, onActiveChange }: BookingStepPropsInterface) {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();

  const circleProgress = useScrollProgress(ref, STEP_CIRCLE_OFFSET);
  const lineProgress = useScrollProgress(ref, STEP_LINE_OFFSET);

  const circleFill = useTransform(circleProgress, [0, 1], [0, 1]);
  const numberColor = useTransform(circleProgress, [0.5, 1], ['#ffffff', '#000000']);
  const textOpacity = useTransform(circleProgress, [0, 1], [0.25, 1]);
  const textY = useTransform(circleProgress, [0, 1], [16, 0]);

  useMotionValueEvent(circleProgress, 'change', (value) => {
    const previous = circleProgress.getPrevious() ?? 0;
    if (previous < 0.5 && value >= 0.5) onActiveChange?.(true);
    if (previous >= 0.5 && value < 0.5) onActiveChange?.(false);
  });

  return (
    <li ref={ref} className='relative flex gap-6 pb-16 last:pb-0'>
      <div className='relative flex size-12 shrink-0 items-center justify-center rounded-full border border-white/30'>
        <motion.span
          className='absolute inset-0 rounded-full bg-white'
          style={{ scale: reduce ? 1 : circleFill }}
        />
        <motion.span
          className='relative text-sm font-medium'
          style={{ color: reduce ? '#000000' : numberColor }}
        >
          {number}
        </motion.span>
      </div>

      {!isLast && (
        <div className='absolute bottom-0 left-6 top-12 w-px -translate-x-1/2 bg-white/15'>
          <motion.div
            className='h-full w-full origin-top bg-white'
            style={{ scaleY: reduce ? 1 : lineProgress }}
          />
        </div>
      )}

      <motion.div
        className='pt-2'
        style={reduce ? undefined : { opacity: textOpacity, y: textY }}
      >
        <h3 className='text-xl text-white'>{title}</h3>
        <p className='mt-2 max-w-md text-base leading-relaxed text-white/60'>{text}</p>
      </motion.div>
    </li>
  );
}