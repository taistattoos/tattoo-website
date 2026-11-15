import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { SITE_NAME } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: `404 | ${SITE_NAME}`,
  robots: { index: false, follow: true },
};

// Served for URLs that match no route (the root layout lives under [locale], so there is no app-wide one).
export default function GlobalNotFound() {
  return (
    <html lang='en'>
      <body className={`${inter.variable} antialiased`}>
        <main className='wrapper flex min-h-screen flex-col items-center justify-center gap-6 text-center'>
          <p className='text-xs uppercase tracking-[0.2em] text-white/40'>404</p>
          <h1 className='text-4xl text-white md:text-5xl'>Page not found</h1>
          <Link href='/en' className='link-underline text-sm uppercase tracking-[0.15em] text-white/70'>
            {SITE_NAME}
          </Link>
        </main>
      </body>
    </html>
  );
}
