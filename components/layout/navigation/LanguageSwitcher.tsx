'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LOCALES } from '@/lib/constants/shared';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const segments = pathname.split('/');
  const currentLocale = segments[1];

  return (
    <nav className="flex items-center gap-3 text-sm, uppercase tracking-[0.15em]">
      {LOCALES.map(({ code, label }) => {
        const isActive = code === currentLocale;
        const newSegments = [...segments];
        newSegments[1] = code;
        const href = newSegments.join('/') || '/';

        return (
          <Link
            key={code}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={
              isActive
                ? ''
                : 'text-[var(--color-paper)]/40 transition-colors'
            }
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
