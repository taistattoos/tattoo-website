import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { CONTENT_PATHS } from '@/lib/constants/content';
import { HomeContentInterface } from '@/types/content';
import { TestimonialContentInterface, TestimonialItem, TestimonialsSectionContent, TestimonialsSectionRaw } from '@/types/testimonials';
import type { AboutContent, AboutRaw } from '@/types/about';
import type { BookingContent, BookingRaw } from '@/types/booking';
import { LocaleEnum } from '@/types/enums';
import type { FaqContent, FaqRaw } from '@/types/faq';
import { FooterContent, FooterRaw } from '@/types/footer';
import type { CategoryContentInterface, CategoryOptionInterface, GalleryContentInterface, GalleryGridItemInterface } from '@/types/gallery';
import type { GalleryPageContent, GalleryPageRaw } from '@/types/gallery';
import { ContactFormContent, ContactFormRaw } from '@/types/contact-form';
import { SiteContent } from '@/types/site';

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

export function getTestimonials(locale: LocaleEnum): TestimonialItem[] {
  return readMarkdownFolder<TestimonialContentInterface>(CONTENT_PATHS.testimonials)
    .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime())
    .map((item) => {
      const original = item.original_language ?? LocaleEnum.EN;

      const translations: Record<LocaleEnum, string | undefined> = {
        en: item.quote_en,
        sr: item.quote_sr,
        ru: item.quote_ru,
      };
      const translation = original !== locale ? translations[locale] : undefined;
      const hasTranslation = typeof translation === 'string' && translation.trim() !== '';

      return {
        slug: item.slug,
        name: item.client_name ?? '',
        quote: hasTranslation ? translation : (item.quote ?? ''),
        rating: item.rating,
        source: item.source,
        translatedFrom: hasTranslation ? original : undefined,
      };
    });
}

export function getTestimonialsSection(locale: LocaleEnum): TestimonialsSectionContent {
  const raw = readMarkdown<TestimonialsSectionRaw>(CONTENT_PATHS.testimonialsSection);

  return { title: pick(raw, 'title', locale) };
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

// Pages

export function getGalleryPage(locale: LocaleEnum): GalleryPageContent {
  const raw = readMarkdown<GalleryPageRaw>(CONTENT_PATHS.galleryPage);

  return {
    galleryHeading: pick(raw, 'gallery_heading', locale),
    galleryCta: pick(raw, 'gallery_cta', locale),
    title: pick(raw, 'page_title', locale),
    intro: pick(raw, 'page_intro', locale),
    favoriteSlug: raw.favorite || undefined,
  };
}

export function getGalleryGridItems(locale: LocaleEnum, featuredOnly = false): GalleryGridItemInterface[] {
  return getGalleryItems()
    .filter((item) => !featuredOnly || item.featured)
    .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
    .map((item) => ({
      slug: item.slug,
      title: item[`title_${locale}`] || item.title_en || '',
      image: item.image || '',
      category: item.category || [],
    }));
}

export function getCategories(locale: LocaleEnum): CategoryOptionInterface[] {
  return readMarkdownFolder<CategoryContentInterface>(CONTENT_PATHS.categories)
    .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
    .map((item) => ({
      slug: item.slug,
      label: item[`name_${locale}`] || item.name_en,
    }));
}

function localize(source: object, key: string, locale: LocaleEnum): string {
  const data = source as Record<string, string | undefined>;
  return data[`${key}_${locale}`] || data[`${key}_en`] || '';
}

export function getContactForm(locale: LocaleEnum): ContactFormContent {
  const raw = readMarkdown<ContactFormRaw>(CONTENT_PATHS.contactForm);

  return {
    locale,
    nameLabel: localize(raw, 'name_label', locale),
    emailLabel: localize(raw, 'email_label', locale),
    submit: localize(raw, 'submit', locale),
    sending: localize(raw, 'sending', locale),
    success: localize(raw, 'success', locale),
    error: localize(raw, 'error', locale),
    questions: (raw.questions ?? []).map((question) => ({
      key: question.key,
      type: question.type,
      label: localize(question, 'label', locale),
      placeholder: localize(question, 'placeholder', locale) || undefined,
      required: question.required ?? false,
      options: (question.options ?? []).map((option) => ({
        value: option.value,
        label: localize(option, 'label', locale),
      })),
      showIf:
        question.show_if_field && question.show_if_value
          ? { field: question.show_if_field, value: question.show_if_value }
          : undefined,
    })),
  };
}

export function getSite(): SiteContent {
  return readMarkdown<SiteContent>(CONTENT_PATHS.site);
}