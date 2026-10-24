'use client';

import type { MouseEvent } from 'react';
import { useLenis } from 'lenis/react';
import { ANCHOR_OFFSET } from '@/lib/constants/scroll';

export function useAnchorScroll() {
  const lenis = useLenis();

  return (event: MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute('href');
    if (!lenis || !href || !href.includes('#')) return;

    const hash = href.slice(href.indexOf('#'));
    const target = hash.length > 1 ? document.querySelector<HTMLElement>(hash) : null;
    if (!target) return;

    event.preventDefault();
    lenis.scrollTo(target, { offset: ANCHOR_OFFSET });
    history.pushState(null, '', hash);
  };
}