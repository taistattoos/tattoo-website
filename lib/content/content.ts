import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GalleryContentInterface, HomeContentInterface } from '@/types/content';

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