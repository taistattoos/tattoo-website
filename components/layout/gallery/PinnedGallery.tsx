'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import CTA from '@/components/ui/CTA';
import { DESKTOP_QUERY, useMediaQuery } from '@/hooks/useMediaQuery';
import type { GalleryGridItemInterface } from '@/types/gallery';

interface PinnedGalleryProps {
  items: GalleryGridItemInterface[];
  heading: ReactNode;
  ctaHref: string;
  ctaLabel: string;
}

// Lines the first photo up with the page's .wrapper content edge, even on very wide screens.
const TRACK_INSET = 'pl-[max(80px,calc((100vw-120rem)/2+80px))] pr-20';

/**
 * Home page gallery.
 * Desktop: the section pins and the photos travel sideways as you scroll down.
 * Phones and reduced motion: a normal grid.
 * Same markup either way, so every image is always in the HTML for Google.
 */
export default function PinnedGallery({ items, heading, ctaHref, ctaLabel }: PinnedGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const [distance, setDistance] = useState(0);

  const horizontal = isDesktop && !reduce;
  // Only pin when the row is wider than the screen; a short row just sits there.
  const pinned = horizontal && distance > 0;

  // Sideways travel = row width minus screen width.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !horizontal) {
      setDistance(0);
      return;
    }

    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [horizontal, items.length]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const x = useTransform(progress, (value) => (pinned ? -value * distance : 0));

  return (
    <section
      ref={sectionRef}
      id='gallery'
      aria-labelledby='gallery-title'
      // The extra height is the scroll "runway" that drives the sideways movement.
      style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}
      className={pinned ? 'relative' : 'relative py-24'}
    >
      <div className={pinned ? 'sticky top-0 flex h-svh flex-col justify-center overflow-hidden' : undefined}>
        <div className='wrapper'>{heading}</div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className={
            horizontal
              ? `flex w-max gap-6 ${TRACK_INSET}`
              : 'wrapper grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4 md:grid-cols-3'
          }
        >
          {items.map((item, index) => (
            <figure
              key={item.slug}
              className={`group relative shrink-0 overflow-hidden bg-neutral-900 ${
                horizontal ? 'aspect-4/5 h-[62vh]' : 'aspect-square'
              }`}
            >
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes='(max-width: 479px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 50vh'
                className='object-cover grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0'
              />
              {horizontal && (
                <figcaption className='absolute inset-x-0 bottom-0 flex items-baseline gap-3 bg-linear-to-t from-black/80 to-transparent p-5 text-sm text-white'>
                  <span className='text-xs text-white/50'>{String(index + 1).padStart(2, '0')}</span>
                  {item.title}
                </figcaption>
              )}
            </figure>
          ))}

          {/* Desktop: the row ends with a card leading to the full gallery. */}
          {horizontal && (
            <Link
              href={ctaHref}
              className='group flex aspect-4/5 h-[62vh] shrink-0 flex-col items-center justify-center gap-4 border border-white/15 text-white transition-colors duration-500 hover:border-white/50'
            >
              <span className='px-6 text-center text-2xl uppercase tracking-[0.15em]'>{ctaLabel}</span>
              <span aria-hidden='true' className='text-3xl transition-transform duration-500 group-hover:translate-x-2'>
                →
              </span>
            </Link>
          )}
        </motion.div>

        {/* Grid layout: the 'view all' button sits under the photos instead. */}
        {!horizontal && ctaLabel && (
          <div className='wrapper mt-12 text-center'>
            <CTA href={ctaHref} text={ctaLabel} />
          </div>
        )}

        {pinned && (
          <div className='wrapper mt-10' aria-hidden='true'>
            <div className='h-px w-full bg-white/10'>
              <motion.div className='h-full origin-left bg-white' style={{ scaleX: progress }} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
