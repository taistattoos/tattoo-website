import type { UseScrollOptions } from 'framer-motion';

export const LENIS_OPTIONS = {
  lerp: 0.1,
  duration: 1.2,
  smoothWheel: true,
  syncTouch: false,
} as const;

export const ANCHOR_OFFSET = -80;

export const STEP_CIRCLE_OFFSET: UseScrollOptions['offset'] = ['start 70%', 'start 40%'];

export const STEP_LINE_OFFSET: UseScrollOptions['offset'] = ['start 40%', 'end 40%'];