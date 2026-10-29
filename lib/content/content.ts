import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { CONTENT_PATHS } from '@/lib/constants/content';
import { HomeContentInterface } from '@/types/content';
import { TestimonialContentInterface } from '@/types/testimonials';
import type { AboutContent, AboutRaw } from '@/types/about';
import type { BookingContent, BookingRaw } from '@/types/booking';
import { LocaleEnum } from '@/types/enums';
import type { FaqContent, FaqRaw } from '@/types/faq';
import { FooterContent, FooterRaw } from '@/types/footer';
import { GalleryContentInterface } from '@/types/gallery';

function readMarkdown<T>(relativePath: string): T {
  const file = fs.readFileSync(path.join(process.cwd(), relativePath), 'utf-8');
  return matter(file).data as T;
}

function readMarkdownFolder<T>(relativeDir: string): T[] {
  const dir = path.join(process.cwd(), relativeDir);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const { data } = matter(fs.readFileSync(path.join(dir, file), 'utf-8'));
      return { slug: file.replace(/\.md$/, ''), ...data } as T;
    });
}

function pick(raw: Record<string, unknown>, key: string, locale: LocaleEnum): string {
  const value = raw[`${key}_${locale}`];
  if (typeof value === 'string' && value.trim() !== '') return value;
  const fallback = raw[`${key}_en`];
  return typeof fallback === 'string' ? fallback : '';
}

export function getHomeContent(): HomeContentInterface {
  return readMarkdown<HomeContentInterface>(CONTENT_PATHS.home);
}

export function getGalleryItems(): GalleryContentInterface[] {
  return readMarkdownFolder<GalleryContentInterface>(CONTENT_PATHS.gallery);
}

export function getTestimonials(): TestimonialContentInterface[] {
  return readMarkdownFolder<TestimonialContentInterface>(CONTENT_PATHS.testimonials).sort(
    (a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
  );
}

export function getAbout(locale: LocaleEnum): AboutContent {
  const raw = readMarkdown<AboutRaw>(CONTENT_PATHS.about);

  return {
    title: pick(raw, 'title', locale),
    body: pick(raw, 'body', locale),
    image: raw.image,
    imageAlt: pick(raw, 'image_alt', locale),
    specialties: (raw.specialties ?? []).map((item) => ({
      title: pick(item, 'title', locale),
      text: pick(item, 'text', locale),
    })),
  };
}

export function getBooking(locale: LocaleEnum): BookingContent {
  const raw = readMarkdown<BookingRaw>(CONTENT_PATHS.booking);

  return {
    title: pick(raw, 'title', locale),
    steps: (raw.steps ?? []).map((step) => ({
      title: pick(step, 'title', locale),
      text: pick(step, 'text', locale),
    })),
  };
}

export function getFaq(locale: LocaleEnum): FaqContent {
  const raw = readMarkdown<FaqRaw>(CONTENT_PATHS.faq);

  return {
    title: pick(raw, 'title', locale),
    items: (raw.items ?? []).map((item) => ({
      question: pick(item, 'question', locale),
      answer: pick(item, 'answer', locale),
    })),
  };
}

export function getFooter(locale: LocaleEnum): FooterContent {
  const raw = readMarkdown<FooterRaw>(CONTENT_PATHS.footer);

  return {
    tagline: pick(raw, 'tagline', locale),
    location: pick(raw, 'location', locale),
    copyrightName: raw.copyright_name || 'Tais Tattoos',
    socials: raw.socials ?? [],
  };
}