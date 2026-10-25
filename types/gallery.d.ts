export type GalleryCategory = 'black-grey' | 'color' | 'japanese' | 'illustrative' | 'whipshading';

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
