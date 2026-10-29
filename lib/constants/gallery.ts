import { LocaleEnum } from '@/types/enums';

export const GALLERY_PREVIEW_LIMIT = 6;

export const GALLERY_LABELS: Record<LocaleEnum, { all: string; empty: string }> = {
  en: { all: 'All', empty: 'Gallery coming soon' },
  sr: { all: 'Sve', empty: 'Galerija uskoro' },
  ru: { all: 'Все', empty: 'Галерея скоро появится' },
};

export const CATEGORY_LABELS: Record<string, Record<LocaleEnum, string>> = {
  'black-grey': { en: 'Black & Grey', sr: 'Crno-sivo', ru: 'Чёрно-серое' },
  color: { en: 'Color', sr: 'Kolor', ru: 'Цвет' },
  japanese: { en: 'Japanese', sr: 'Japanski', ru: 'Японский' },
  illustrative: { en: 'Illustrative', sr: 'Ilustrativni', ru: 'Иллюстративный' },
  whipshading: { en: 'Whipshading', sr: 'Whipshading', ru: 'Whipshading' },
};