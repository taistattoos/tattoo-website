import { LocaleEnum } from './enums';

export interface ProductRaw {
  slug: string;
  name_en?: string;
  name_sr?: string;
  name_ru?: string;
  description_en?: string;
  description_sr?: string;
  description_ru?: string;
  image?: string;
  image_alt_en?: string;
  price_rsd?: number;
  price_eur?: number;
  available?: boolean;
  order?: number;
}

export interface ProductItem {
  slug: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  priceRsd: number;
  priceEur: number;
  available: boolean;
}

export interface ShopPageRaw {
  page_title_en?: string;
  page_title_sr?: string;
  page_title_ru?: string;
  page_intro_en?: string;
  page_intro_sr?: string;
  page_intro_ru?: string;
  sold_out_en?: string;
  sold_out_sr?: string;
  sold_out_ru?: string;
  empty_en?: string;
  empty_sr?: string;
  empty_ru?: string;
}

export interface ShopPageContent {
  title: string;
  intro: string;
  soldOut: string;
  empty: string;
}

export interface ShopOrderContent {
  locale: LocaleEnum;
  heading: string;
  quantity: string;
  total: string;
  name: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  postal: string;
  note: string;
  deliveryNote: string;
  emptyCart: string;
  submit: string;
  sending: string;
  success: string;
  error: string;
  consentText: string;
  consentLink: string;
}

export interface OrderItem {
  slug: string;
  quantity: number;
}

export interface OrderFields {
  name: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  postal: string;
  note: string;
}

export interface OrderLine {
  slug: string;
  name: string;
  quantity: number;
  unitRsd: number;
  unitEur: number;
}

export interface ValidatedOrder {
  customer: OrderFields;
  lines: OrderLine[];
  totalRsd: number;
  totalEur: number;
}