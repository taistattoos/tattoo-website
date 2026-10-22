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

const ABOUT_CONTENT_PATH = 'content/about.json';

function pick(raw: AboutRaw, key: 'title' | 'body' | 'image_alt', locale: AboutLocale): string {
  const value = raw[`${key}_${locale}`];
  return value && value.trim() !== '' ? value : (raw[`${key}_en`] ?? '');
}

export function getAbout(locale: AboutLocale): AboutContent {
  const file = fs.readFileSync(path.join(process.cwd(), ABOUT_CONTENT_PATH), 'utf-8');
  const raw = JSON.parse(file) as AboutRaw;

  return {
    title: pick(raw, 'title', locale),
    body: pick(raw, 'body', locale),
    image: raw.image,
    imageAlt: pick(raw, 'image_alt', locale),
  };
}