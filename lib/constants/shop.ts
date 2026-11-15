import { LocaleEnum } from '@/types/enums';
import type { OrderFields } from '@/types/shop';

export const SHOP_MAX_QUANTITY = 20;
export const ORDER_MAX_LINES = 50;
export const ORDER_MAX_BODY_BYTES = 10_000;
export const ORDER_MIN_FILL_MS = 8000;

export const ORDER_LIMITS: Record<keyof OrderFields, number> = {
  name: 100,
  phone: 30,
  email: 254,
  street: 150,
  city: 80,
  postal: 5,
  note: 500,
};

export const INITIAL_ORDER_FIELDS: OrderFields = {
  name: '',
  phone: '',
  email: '',
  street: '',
  city: '',
  postal: '',
  note: '',
};

interface OrderFieldConfig {
  key: Exclude<keyof OrderFields, 'note'>;
  type: 'text' | 'tel' | 'email';
  autoComplete: string;
  maxLength: number;
  wide?: boolean;
  pattern?: string;
  inputMode?: 'numeric';
}

export const ORDER_FIELDS: OrderFieldConfig[] = [
  { key: 'name', type: 'text', autoComplete: 'name', maxLength: ORDER_LIMITS.name },
  { key: 'phone', type: 'tel', autoComplete: 'tel', maxLength: ORDER_LIMITS.phone },
  { key: 'email', type: 'email', autoComplete: 'email', maxLength: ORDER_LIMITS.email, wide: true },
  { key: 'street', type: 'text', autoComplete: 'street-address', maxLength: ORDER_LIMITS.street, wide: true },
  { key: 'city', type: 'text', autoComplete: 'address-level2', maxLength: ORDER_LIMITS.city },
  {
    key: 'postal',
    type: 'text',
    autoComplete: 'postal-code',
    maxLength: ORDER_LIMITS.postal,
    pattern: '[0-9]{5}',
    inputMode: 'numeric',
  },
];
// Seller information shown on the shop page (required for selling online in Serbia).
export const SELLER_LABELS: Record<LocaleEnum, { heading: string; address: string; mb: string; pib: string }> = {
  en: { heading: 'Seller', address: 'Address', mb: 'Registration no. (MB)', pib: 'Tax no. (PIB)' },
  sr: { heading: 'Prodavac', address: 'Adresa', mb: 'Matični broj', pib: 'PIB' },
  ru: { heading: 'Продавец', address: 'Адрес', mb: 'Регистрационный номер (MB)', pib: 'ИНН (PIB)' },
};
