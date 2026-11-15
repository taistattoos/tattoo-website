'use client';

import type { ReactNode } from 'react';
import { ReactLenis } from 'lenis/react';
import { MotionConfig, useReducedMotion } from 'framer-motion';
import { LENIS_OPTIONS } from '@/lib/constants/scroll';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  // reducedMotion="user": for visitors who ask their system to reduce motion, every Framer Motion
  // animation on the site skips movement and resizing (content still appears, it just doesn't slide).
  const content = <MotionConfig reducedMotion='user'>{children}</MotionConfig>;

  if (reduce) return content;

  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      {content}
    </ReactLenis>
  );
}
