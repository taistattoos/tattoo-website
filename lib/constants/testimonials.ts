import { LocaleEnum } from '@/types/enums';

export const TRANSLATED_LABELS: Record<LocaleEnum, { prefix: string; from: Record<LocaleEnum, string> }> = {
  en: { prefix: 'Translated from', from: { en: 'English', sr: 'Serbian', ru: 'Russian' } },
  sr: { prefix: 'Prevedeno sa', from: { en: 'engleskog', sr: 'srpskog', ru: 'ruskog' } },
  ru: { prefix: 'Переведено с', from: { en: 'английского', sr: 'сербского', ru: 'русского' } },
};

// How many reviews show before "Show all": fewer on phones, where cards stack in one column.
export const TESTIMONIALS_INITIAL_COUNT = { mobile: 3, tablet: 6 } as const;

// Matches the grid going to two columns (Tailwind md).
export const TESTIMONIALS_TABLET_QUERY = '(min-width: 768px)';

export const TESTIMONIALS_TOGGLE_LABELS: Record<LocaleEnum, { more: string; less: string }> = {
  en: { more: 'Show all reviews', less: 'Show fewer reviews' },
  sr: { more: 'Prikaži sve utiske', less: 'Prikaži manje utisaka' },
  ru: { more: 'Показать все отзывы', less: 'Свернуть отзывы' },
};
