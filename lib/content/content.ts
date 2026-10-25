import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { CONTENT_PATHS } from '@/lib/constants/content';
import { GalleryContentInterface, HomeContentInterface } from '@/types/content';
import { TestimonialContentInterface } from '@/types/home';
import type { AboutContent, AboutRaw } from '@/types/about';
import type { BookingContent, BookingRaw } from '@/types/booking';
import { LocaleEnum } from '@/types/enums';

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
  return readMarkdownFolder<TestimonialContentInterface>(CONTENT_PATHS.testimonials);
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