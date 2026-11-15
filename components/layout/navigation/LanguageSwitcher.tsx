'use client';

import { useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { LOCALES } from '@/lib/constants/shared';
import { getCurrentLocale, getLocalizedPath } from '@/lib/utils/locale';
import { useClickOutside } from '@/hooks/useClickOutside';

interface LanguageSwitcherPropsInterface {
  inline?: boolean;
  className?: string;
  onNavigate?: () => void;
}

export default function LanguageSwitcher({ inline = false, className = '', onNavigate }: LanguageSwitcherPropsInterface) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setOpen(false), open);

  const currentCode = getCurrentLocale(pathname);
  const current = LOCALES.find((locale) => locale.code === currentCode) ?? LOCALES[0];
  const others = LOCALES.filter((locale) => locale.code !== current.code);

  // Inline (mobile menu): show every locale in a row — no dropdown, so nothing expands or jumps.
  if (inline) {
    return (
      <ul className={`${className} flex items-center gap-6 text-sm uppercase tracking-[0.15em]`}>
        {LOCALES.map(({ code, label }) => {
          const active = code === current.code;
          return (
            <li key={code}>
              <Link
                href={getLocalizedPath(pathname, code)}
                onClick={onNavigate}
                aria-current={active ? 'true' : undefined}
                className={`transition-colors duration-300 ${
                  active ? 'text-white' : 'text-white/40 hover:text-white'
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div ref={containerRef} className={`${className} relative text-sm uppercase tracking-[0.15em]`}>
      <button
        type='button'
        onClick={() => setOpen((value) => !value)}
        aria-haspopup='true'
        aria-expanded={open}
        className='flex cursor-pointer items-center gap-2 text-white'
      >
        {current.label}
        <svg
          width='10'
          height='6'
          viewBox='0 0 10 6'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.5'
          aria-hidden='true'
          className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          <path d='M1 1l4 4 4-4' />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className='absolute right-0 top-full mt-4 flex min-w-full flex-col gap-3 border border-white/10 bg-black/90 px-4 py-3 backdrop-blur-md'
          >
            {others.map(({ code, label }) => (
              <li key={code}>
                <Link
                  href={getLocalizedPath(pathname, code)}
                  onClick={() => setOpen(false)}
                  className='text-white/60 transition-colors hover:text-white'
                >
                  {label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
