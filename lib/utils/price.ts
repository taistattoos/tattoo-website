import type { LocaleEnum } from '@/types/enums';

const LOCALE_TAGS: Record<LocaleEnum, string> = {
  en: 'en-GB',
  sr: 'sr-Latn-RS',
  ru: 'ru-RU',
};

export function formatPrice(amount: number, currency: 'RSD' | 'EUR', locale: LocaleEnum): string {
  return new Intl.NumberFormat(LOCALE_TAGS[locale], {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'RSD' ? 0 : 2,
    maximumFractionDigits: currency === 'RSD' ? 0 : 2,
  }).format(amount);
}