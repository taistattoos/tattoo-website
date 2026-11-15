import { LocaleEnum } from '@/types/enums';

interface PageMetaInterface {
  title: string;
  description: string;
}

// Keep titles under ~60 characters and descriptions under ~155 so Google doesn't cut them off.
export const HOME_META: Record<LocaleEnum, PageMetaInterface> = {
  en: {
    title: 'Tais Tattoos | Japanese-Style Tattoos in Belgrade & Novi Sad',
    description:
      'Custom, highly detailed Japanese-style tattoos, dark work, animal mascots and pet portraits by Tais in Belgrade, Novi Sad and Zrenjanin. Book a consultation.',
  },
  sr: {
    title: 'Tais Tattoos | Tetovaže u japanskom stilu, Beograd i Novi Sad',
    description:
      'Unikatne, detaljne tetovaže u japanskom stilu, dark work, maskote i portreti ljubimaca. Tais radi u Beogradu, Novom Sadu i Zrenjaninu. Zakažite konsultaciju.',
  },
  ru: {
    title: 'Tais Tattoos | Тату в японском стиле в Белграде и Нови-Саде',
    description:
      'Индивидуальные детализированные тату в японском стиле, dark work, маскоты и портреты питомцев от Таис. Белград, Нови-Сад и Зренянин. Запишитесь на консультацию.',
  },
};

// Search-result titles for the Gallery page. The visible heading stays the short CMS title ("Gallery").
export const GALLERY_SEO_TITLE: Record<LocaleEnum, string> = {
  en: 'Tattoo Gallery: Japanese-Style Work',
  sr: 'Galerija tetovaža u japanskom stilu',
  ru: 'Галерея татуировок в японском стиле',
};

export const AREA_SERVED = ['Belgrade', 'Novi Sad', 'Zrenjanin'];
