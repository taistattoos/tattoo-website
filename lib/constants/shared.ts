export const NAV_LABELS: Record<string, { gallery: string; about: string; contact: string }> = {
  en: { gallery: 'Gallery', about: 'About', contact: 'Contact' },
  sr: { gallery: 'Galerija', about: 'O meni', contact: 'Kontakt' },
  ru: { gallery: 'Галерея', about: 'Обо мне', contact: 'Контакты' },
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