export interface HomeContentInterface {
  eyebrow_en?: string;
  eyebrow_sr?: string;
  eyebrow_ru?: string;
  headline_en?: string;
  headline_sr?: string;
  headline_ru?: string;
  subheadline_en?: string;
  subheadline_sr?: string;
  subheadline_ru?: string;
  cta_label_en?: string;
  cta_label_sr?: string;
  cta_label_ru?: string;
  cta_link?: string;
  gallery_heading_en?: string;
  gallery_heading_sr?: string;
  gallery_heading_ru?: string;
  gallery_cta_en?: string;
  gallery_cta_sr?: string;
  gallery_cta_ru?: string;
};

export type GalleryCategory =
  | 'black-grey'
  | 'color'
  | 'japanese'
  | 'illustrative'
  | 'whipshading';

export interface GalleryContentInterface {
  slug: string;
  title_en?: string;
  title_sr?: string;
  title_ru?: string;
  image?: string;
  category?: GalleryCategory[];
  featured?: boolean;
  order?: number;
}