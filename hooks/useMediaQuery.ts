'use client';

import { useEffect, useState } from 'react';

/** Desktop breakpoint for scroll effects (Tailwind `lg`). */
export const DESKTOP_QUERY = '(min-width: 1024px)';

/** Tracks a CSS media query. False on the server and first render, so markup always starts as the mobile layout. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);

  return matches;
}
