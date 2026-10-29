import type { LocaleEnum } from './enums';
export interface TestimonialContentInterface {
  slug: string;
  client_name?: string;
  quote?: string;
  rating?: number;
  source?: string;
  date?: string;
  original_language?: LocaleEnum;
  quote_en?: string;
  quote_sr?: string;
  quote_ru?: string;
}

export type TestimonialItem = {
  slug: string;
  name: string;
  quote: string;
  rating?: number;
  source?: string;
  translatedFrom?: LocaleEnum;
};

type Localized<K extends string> = Record<`${K}_${LocaleEnum}`, string>;

export type TestimonialsSectionRaw = Localized<'title'>;

export type TestimonialsSectionContent = {
  title: string;
};