interface NavLabelsInterface {
  gallery: string;
  about: string;
  contact: string;
  shop: string;
}

export const NAV_LABELS: Record<string, NavLabelsInterface> = {
  en: { gallery: 'Gallery', about: 'About', contact: 'Contact', shop: 'Shop' },
  sr: { gallery: 'Galerija', about: 'O meni', contact: 'Kontakt', shop: 'Prodavnica' },
  ru: { gallery: 'Галерея', about: 'Обо мне', contact: 'Контакты', shop: 'Магазин' },
};

type LocaleType = {
  code: 'en' | 'sr' | 'ru',
  label: 'EN' | 'SR' | 'RU'
}

export const LOCALES: LocaleType[] = [
  { code: 'en', label: 'EN' },
  { code: 'sr', label: 'SR' },
  { code: 'ru', label: 'RU' },
];

export const NAV_ANCHORS = ['gallery', 'about', 'contact'] as const;

