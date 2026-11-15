'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { useLenis } from 'lenis/react';
import LanguageSwitcher from './LanguageSwitcher';
import { NAV_LABELS } from '@/lib/constants/shared';

const EASE = [0.76, 0, 0.24, 1] as const;

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Navigation({ locale, shopEnabled = false }: { locale: string, shopEnabled?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lenis = useLenis();

  const labels = NAV_LABELS[locale] ?? NAV_LABELS.en;

  const NAV_LINKS = [
    { href: `/${locale}/gallery`, label: labels.gallery },
    { href: `/${locale}/about`, label: labels.about },
    ...(shopEnabled ? [{ href: `/${locale}/shop`, label: labels.shop }] : []),
    { href: `/${locale}/contact`, label: labels.contact },
  ];

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock scrolling while the menu is open. Lenis intercepts wheel/touch, so stop it too.
  useEffect(() => {
    if (!menuOpen) return;
    const root = document.documentElement;
    root.style.overflow = 'hidden';
    lenis?.stop();
    return () => {
      root.style.overflow = '';
      lenis?.start();
    };
  }, [menuOpen, lenis]);

  // Close on Escape, and when the viewport grows past the mobile breakpoint.
  useEffect(() => {
    if (!menuOpen) return;
    const desktop = window.matchMedia('(min-width: 768px)');
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false);
    const onChange = (event: MediaQueryListEvent) => event.matches && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onChange);
    return () => {
      window.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onChange);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-colors duration-500 ${
          scrolled && !menuOpen ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className='wrapper flex items-center justify-between py-5 md:grid md:grid-cols-[1fr_auto_1fr]'>
          <Link
            href={`/${locale}`}
            onClick={closeMenu}
            className='justify-self-start text-3xl font-semibold text-white'
          >
            TAIS
          </Link>

          {/* Desktop nav — visible from md up */}
          <nav className='hidden items-center gap-6 text-lg uppercase tracking-[0.15em] text-white/60 md:flex lg:gap-8'>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className='link-underline'>
                {link.label}
              </Link>
            ))}
          </nav>

          <LanguageSwitcher className='hidden cursor-pointer justify-self-end md:inline-block' />

          {/* Hamburger — visible below md */}
          <button
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls='mobile-menu'
            className='relative flex h-8 w-8 cursor-pointer flex-col items-center justify-center gap-1.5 md:hidden'
          >
            <span
              className={`h-px w-6 bg-white transition-transform duration-500 ease-in-out ${
                menuOpen ? 'translate-y-1.75 rotate-45' : ''
              }`}
            />
            <span
              className={`h-px w-6 bg-white transition-opacity duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`}
            />
            <span
              className={`h-px w-6 bg-white transition-transform duration-500 ease-in-out ${
                menuOpen ? '-translate-y-1.75 -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu — full-screen panel sliding in from the right, under the header bar */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id='mobile-menu'
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.7, ease: EASE }}
            className='fixed inset-0 z-40 flex flex-col bg-(--color-ink) md:hidden'
          >
            <nav className='wrapper flex flex-1 flex-col justify-center'>
              <motion.ul
                variants={listVariants}
                initial='hidden'
                animate='visible'
                className='flex flex-col gap-6'
              >
                {NAV_LINKS.map((link, index) => (
                  <motion.li key={link.href} variants={itemVariants} className='flex items-baseline gap-4'>
                    <span className='text-xs text-white/30'>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className='link-underline text-3xl uppercase text-white min-[361px]:text-4xl sm:text-5xl'
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className='wrapper flex items-center justify-between border-t border-white/10 py-8'
            >
              <LanguageSwitcher inline onNavigate={closeMenu} />
              <span className='text-xs uppercase tracking-[0.15em] text-white/30'>TAIS</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
