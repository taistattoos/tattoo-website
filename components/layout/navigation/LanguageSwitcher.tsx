'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'sr', label: 'SR' },
  { code: 'ru', label: 'RU' },
];

export default function LanguageSwitcher() {
  const pathname = usePathname(); // e.g. "/en/gallery"
  const segments = pathname.split('/'); // ["", "en", "gallery"]
  const currentLocale = segments[1];

  return (
    <nav className="flex items-center gap-3 font-[var(--font-mono)] text-xs uppercase tracking-[0.15em]">
      {LOCALES.map(({ code, label }) => {
        const isActive = code === currentLocale;
        const newSegments = [...segments];
        newSegments[1] = code; // swap just the locale segment, keep the rest of the path
        const href = newSegments.join('/') || '/';

        return (
          <Link
            key={code}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={
              isActive
                ? 'text-[var(--color-paper)]'
                : 'text-[var(--color-paper)]/40 transition-colors hover:text-[var(--color-paper)]/70'
            }
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
