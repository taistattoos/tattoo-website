import { LocaleEnum } from '@/types/enums';

export const TRANSLATED_LABELS: Record<LocaleEnum, { prefix: string; from: Record<LocaleEnum, string> }> = {
  en: { prefix: 'Translated from', from: { en: 'English', sr: 'Serbian', ru: 'Russian' } },
  sr: { prefix: 'Prevedeno sa', from: { en: 'engleskog', sr: 'srpskog', ru: 'ruskog' } },
  ru: { prefix: 'Переведено с', from: { en: 'английского', sr: 'сербского', ru: 'русского' } },
};