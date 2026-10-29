'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';
import { NAV_LABELS } from '@/lib/constants/shared';

export default function Navigation({ locale }: { locale: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const labels = NAV_LABELS[locale] ?? NAV_LABELS.en;
  const NAV_LINKS = [
    { href: `/${locale}/gallery`, label: labels.gallery },
    { href: `/${locale}/about`, label: labels.about },
    { href: `/${locale}/contact`, label: labels.contact },
  ];

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        scrolled || menuOpen ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className='wrapper flex items-center justify-between py-5'>
        <Link href={`/${locale}`} className='block text-xl font-semibold text-white'>
          TAIS
        </Link>

        {/* Desktop nav — visible from lg up */}
        <nav className='hidden items-center gap-8 text-xs uppercase tracking-[0.15em] text-white/60 md:flex'>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className='link-underline text-lg'>
              {link.label}
            </Link>
          ))}
        </nav>

        <LanguageSwitcher className='hidden md:inline-block cursor-pointer' />

        {/* Hamburger — visible md and below (hidden from lg up) */}
        <button
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className='relative cursor-pointer z-50 flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden'
        >
          <span
            className={`h-px w-6 bg-white transition-transform duration-300 ${
              menuOpen ? 'translate-y-1.75 rotate-45' : ''
            }`}
          />
          <span
            className={`h-px w-6 bg-white transition-opacity duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`}
          />
          <span
            className={`h-px w-6 bg-white transition-transform duration-300 ${
              menuOpen ? '-translate-y-1.75 -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='overflow-hidden bg-black/80 backdrop-blur-md lg:hidden'
          >
            <nav className='wrapper flex flex-col gap-6 py-8 text-sm uppercase tracking-[0.15em] text-white/70'>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className='link-underline w-fit text-sm'
                >
                  {link.label}
                </Link>
              ))}
              <div className='pt-2'>
                <LanguageSwitcher inline />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
