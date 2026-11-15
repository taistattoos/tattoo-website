import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { CONTENT_PATHS } from '@/lib/constants/content';
import { HomeContentInterface } from '@/types/content';
import {
  TestimonialContentInterface,
  TestimonialItem,
  TestimonialsSectionContent,
  TestimonialsSectionRaw,
} from '@/types/testimonials';
import type { AboutContent, AboutRaw } from '@/types/about';
import type { BookingContent, BookingRaw } from '@/types/booking';
import { LocaleEnum } from '@/types/enums';
import type { FaqContent, FaqRaw } from '@/types/faq';
import { FooterContent, FooterRaw } from '@/types/footer';
import type {
  CategoryContentInterface,
  CategoryOptionInterface,
  GalleryContentInterface,
  GalleryGridItemInterface,
} from '@/types/gallery';
import type { GalleryPageContent, GalleryPageRaw } from '@/types/gallery';
import { ContactFormContent, ContactFormRaw } from '@/types/contact-form';
import type { SiteContent, SiteRaw } from '@/types/site';
import { ALLOW_INDEXING } from '@/lib/seo';
import { LegalPageContent, LegalPageRaw } from '@/types/legal';
import { ProductItem, ProductRaw, ShopOrderContent, ShopPageContent, ShopPageRaw } from '@/types/shop';

function readMarkdown<T>(relativePath: string): T {
  const file = fs.readFileSync(path.join(/*turbopackIgnore: true*/ process.cwd(), relativePath), 'utf-8');
  return matter(file).data as T;
}

function readMarkdownFolder<T>(relativeDir: string): T[] {
  const dir = path.join(/*turbopackIgnore: true*/ process.cwd(), relativeDir);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(/*turbopackIgnore: true*/ dir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const { data } = matter(fs.readFileSync(path.join(/*turbopackIgnore: true*/ dir, file), 'utf-8'));
      return { slug: file.replace(/\.md$/, ''), ...data } as T;
    });
}

function pick(source: object, key: string, locale: LocaleEnum): string {
  const raw = source as Record<string, unknown>;
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
      image: step.image || undefined,
      imageAlt: pick(step, 'image_alt', locale) || pick(step, 'title', locale),
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
      title: pick(item, 'title', locale),
      image: item.image || '',
      imageAlt: pick(item, 'image_alt', locale) || pick(item, 'title', locale),
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

export function getContactForm(locale: LocaleEnum): ContactFormContent {
  const raw = readMarkdown<ContactFormRaw>(CONTENT_PATHS.contactForm);

  return {
    locale,
    consentText: pick(raw, 'consent_text', locale),
    consentLink: pick(raw, 'consent_link', locale),
    nameLabel: pick(raw, 'name_label', locale),
    emailLabel: pick(raw, 'email_label', locale),
    submit: pick(raw, 'submit', locale),
    sending: pick(raw, 'sending', locale),
    success: pick(raw, 'success', locale),
    error: pick(raw, 'error', locale),
    questions: (raw.questions ?? []).map((question) => ({
      key: question.key,
      type: question.type,
      label: pick(question, 'label', locale),
      placeholder: pick(question, 'placeholder', locale) || undefined,
      required: question.required ?? false,
      options: (question.options ?? []).map((option) => ({
        value: option.value,
        label: pick(option, 'label', locale),
      })),
      showIf:
        question.show_if_field && question.show_if_value
          ? { field: question.show_if_field, value: question.show_if_value }
          : undefined,
    })),
  };
}

export function getPrivacyPage(locale: LocaleEnum): LegalPageContent {
  const raw = readMarkdown<LegalPageRaw>(CONTENT_PATHS.privacy);

  const updated = raw.updated instanceof Date ? raw.updated.toISOString().slice(0, 10) : (raw.updated ?? '');

  return {
    title: pick(raw, 'title', locale),
    body: pick(raw, 'body', locale),
    updated,
  };
}

export function getShopPage(locale: LocaleEnum): ShopPageContent {
  const raw = readMarkdown<ShopPageRaw>(CONTENT_PATHS.shopPage);

  return {
    title: pick(raw, 'page_title', locale),
    intro: pick(raw, 'page_intro', locale),
    soldOut: pick(raw, 'sold_out', locale),
    empty: pick(raw, 'empty', locale),
  };
}

export function getProducts(locale: LocaleEnum): ProductItem[] {
  return readMarkdownFolder<ProductRaw>(CONTENT_PATHS.products)
    .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
    .map((item) => ({
      slug: item.slug,
      name: pick(item, 'name', locale),
      description: pick(item, 'description', locale),
      image: item.image ?? '',
      imageAlt: pick(item, 'image_alt', locale) || pick(item, 'name', locale),
      priceRsd: item.price_rsd ?? 0,
      priceEur: item.price_eur ?? 0,
      available: item.available !== false,
    }));
}

export function getShopOrder(locale: LocaleEnum): ShopOrderContent {
  const raw = readMarkdown<Record<string, string>>(CONTENT_PATHS.shopOrder);

  return {
    locale,
    heading: pick(raw, 'order_heading', locale),
    quantity: pick(raw, 'quantity', locale),
    total: pick(raw, 'total', locale),
    name: pick(raw, 'name', locale),
    phone: pick(raw, 'phone', locale),
    email: pick(raw, 'email', locale),
    street: pick(raw, 'street', locale),
    city: pick(raw, 'city', locale),
    postal: pick(raw, 'postal', locale),
    note: pick(raw, 'note', locale),
    deliveryNote: pick(raw, 'delivery_note', locale),
    emptyCart: pick(raw, 'empty_cart', locale),
    submit: pick(raw, 'submit', locale),
    sending: pick(raw, 'sending', locale),
    success: pick(raw, 'success', locale),
    error: pick(raw, 'error', locale),
    consentText: pick(raw, 'consent_text', locale),
    consentLink: pick(raw, 'consent_link', locale),
    confirmSubject: pick(raw, 'confirm_subject', locale),
    confirmIntro: pick(raw, 'confirm_intro', locale),
    confirmOutro: pick(raw, 'confirm_outro', locale),
  };
}

export function getSite(): SiteContent {
  const raw = readMarkdown<SiteRaw>(CONTENT_PATHS.site);

  const sellerFields = [raw.seller_name, raw.seller_address, raw.seller_mb, raw.seller_pib].map((value) =>
    typeof value === 'string' ? value.trim() : '',
  );
  const [name, address, mb, pib] = sellerFields;
  const seller = sellerFields.every(Boolean) ? { name, address, mb, pib } : undefined;

  // Launch safeguard: on the live site, selling without seller details is not allowed in Serbia,
  // so the shop stays hidden even if the switch is on. During development it works without them.
  const switchedOn = raw.shop_enabled === true;
  const blocked = switchedOn && ALLOW_INDEXING && !seller;

  return {
    favicon: raw.favicon,
    contact_email: raw.contact_email?.trim() || undefined,
    shop_enabled: switchedOn && !blocked,
    shop_blocked: blocked,
    seller,
  };
}
