'use client';

import type { RefObject } from 'react';
import { useScroll, type MotionValue, type UseScrollOptions } from 'framer-motion';

const DEFAULT_OFFSET: UseScrollOptions['offset'] = ['start 70%', 'end 60%'];

export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  offset: UseScrollOptions['offset'] = DEFAULT_OFFSET
): MotionValue<number> {
  const { scrollYProgress } = useScroll({ target: ref, offset });
  return scrollYProgress;
}