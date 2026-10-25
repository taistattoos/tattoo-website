import fs from 'fs';

import path from 'path';
import matter from 'gray-matter';
import { GalleryContentInterface, HomeContentInterface } from '@/types/content';
import { TestimonialContentInterface } from '@/types/home';
import type { AboutContent, AboutLocale, AboutRaw } from '@/types/about';

export function getHomeContent(): HomeContentInterface {
  const filePath = path.join(process.cwd(), 'content', 'home.md');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(raw);
  return data as HomeContentInterface;
}

export function getGalleryItems(): GalleryContentInterface[] {
  const dir = path.join(process.cwd(), 'content', 'gallery');
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
    const { data } = matter(raw);
    return { slug: file.replace(/\.md$/, ''), ...data } as GalleryContentInterface;
  });
}

export function getTestimonials(): TestimonialContentInterface[] {
  const dir = path.join(process.cwd(), 'content', 'testimonials');
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
    const { data } = matter(raw);
    return { slug: file.replace(/\.md$/, ''), ...data } as TestimonialContentInterface;
  });
}

const ABOUT_CONTENT_PATH = 'content/about/about.md';

function pick(raw: Record<string, unknown>, key: string, locale: AboutLocale): string {
  const value = raw[`${key}_${locale}`];
  if (typeof value === 'string' && value.trim() !== '') return value;
  const fallback = raw[`${key}_en`];
  return typeof fallback === 'string' ? fallback : '';
}

export function getAbout(locale: AboutLocale): AboutContent {
  const file = fs.readFileSync(path.join(process.cwd(), ABOUT_CONTENT_PATH), 'utf-8');
  const raw = matter(file).data as AboutRaw;

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