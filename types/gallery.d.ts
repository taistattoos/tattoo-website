import type { LocaleEnum } from './enums';

export interface GalleryContentInterface {
  slug: string;
  title_en?: string;
  title_sr?: string;
  title_ru?: string;
  image?: string;
  category?: string[];
  featured?: boolean;
  order?: number;
}

export type GalleryGridProps = {
  items: GalleryGridItemInterface[];
  locale: LocaleEnum;
  categories?: CategoryOptionInterface[];
  showFilters?: boolean;
};

export interface GalleryGridItemInterface {
  slug: string;
  title: string;
  image: string;
  category: string[];
}

export interface CategoryContentInterface {
  slug: string;
  name_en: string;
  name_sr?: string;
  name_ru?: string;
  order?: number;
}

export interface CategoryOptionInterface {
  slug: string;
  label: string;
}

type Localized<K extends string> = Record<`${K}_${LocaleEnum}`, string>;

export type GalleryPageRaw = Localized<'gallery_heading'> &
  Localized<'gallery_cta'> &
  Localized<'page_title'> &
  Localized<'page_intro'> & {
    favorite?: string;
  };

export type GalleryPageContent = {
  galleryHeading: string;
  galleryCta: string;
  title: string;
  intro: string;
  favoriteSlug?: string;
};