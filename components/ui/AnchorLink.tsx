'use client';

import type { AnchorHTMLAttributes } from 'react';
import { useAnchorScroll } from '@/hooks/useAnchorScroll';

export default function AnchorLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const handleAnchorClick = useAnchorScroll();

  return (
    <a
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        handleAnchorClick(event);
      }}
    />
  );
}