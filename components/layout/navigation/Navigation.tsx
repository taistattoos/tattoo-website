'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { NAV_LABELS } from '@/lib/constants/shared';

const NAV_LINKS = [
  { href: '#gallery', label: 'Gallery' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export default function Navigation({ locale }: { locale: string }) {
  const [scrolled, setScrolled] = useState(false);

  const labels = NAV_LABELS[locale] ?? NAV_LABELS.en;

  const NAV_LINKS = [
    { href: '#gallery', label: labels.gallery },
    { href: '#about', label: labels.about },
    { href: '#contact', label: labels.contact },
  ];

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


  return (
    <header
      className={`sticky top-0 z-50 px-6 transition-colors duration-300 sm:px-12 lg:px-20 ${
        scrolled
          ? 'bg-[var(--color-ink)]/80 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between py-5">
        <Link
          href={`/${locale}`}
          className="font-[var(--font-display)] text-lg italic text-[var(--color-paper)]"
        >
          Tais Tattoos
        </Link>

        <nav className="hidden items-center gap-8 font-[var(--font-mono)] text-xs uppercase tracking-[0.15em] text-[var(--color-paper)]/60 sm:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={`/${locale}${link.href}`}
              className="transition-colors hover:text-[var(--color-paper)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <LanguageSwitcher />
      </div>
    </header>
  );
}
