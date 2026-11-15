import { ORDER_LIMITS, ORDER_MAX_LINES, SHOP_MAX_QUANTITY } from '@/lib/constants/shop';
import { isValidEmail } from '@/lib/server/email-address';
import type { OrderFields, OrderLine, ProductItem, ValidatedOrder } from '@/types/shop';

const PHONE_PATTERN = /^\+?[\d\s()\-/.]{6,30}$/;
const POSTAL_PATTERN = /^\d{5}$/;

type Result = { ok: true; data: ValidatedOrder } | { ok: false };

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function clean(value: unknown, max: number, multiline = false): string | null {
  if (typeof value !== 'string') return null;
  const pattern = multiline ? /[\u0000-\u0008\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g;
  const text = value.replace(pattern, '').trim();
  return text.length <= max ? text : null;
}

function validateItems(value: unknown, products: ProductItem[]): OrderLine[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > ORDER_MAX_LINES) return null;

  const seen = new Set<string>();
  const lines: OrderLine[] = [];

  for (const item of value) {
    if (!isRecord(item)) return null;
    const { slug, quantity } = item;

    if (typeof slug !== 'string' || seen.has(slug)) return null;
    if (typeof quantity !== 'number' || !Number.isInteger(quantity)) return null;
    if (quantity < 1 || quantity > SHOP_MAX_QUANTITY) return null;

    const product = products.find((candidate) => candidate.slug === slug);
    if (!product || !product.available) return null;

    seen.add(slug);
    lines.push({
      slug,
      name: product.name,
      quantity,
      unitRsd: product.priceRsd,
      unitEur: product.priceEur,
    });
  }

  return lines;
}

function validateCustomer(value: unknown): OrderFields | null {
  if (!isRecord(value)) return null;

  const name = clean(value.name, ORDER_LIMITS.name);
  const phone = clean(value.phone, ORDER_LIMITS.phone);
  const email = clean(value.email, ORDER_LIMITS.email);
  const street = clean(value.street, ORDER_LIMITS.street);
  const city = clean(value.city, ORDER_LIMITS.city);
  const postal = clean(value.postal, ORDER_LIMITS.postal);
  const note = value.note === undefined || value.note === '' ? '' : clean(value.note, ORDER_LIMITS.note, true);

  if (name === null || name.length < 2) return null;
  if (phone === null || !PHONE_PATTERN.test(phone)) return null;
  if (email === null || !isValidEmail(email)) return null;
  if (street === null || street.length < 3) return null;
  if (city === null || city.length < 2) return null;
  if (postal === null || !POSTAL_PATTERN.test(postal)) return null;
  if (note === null) return null;

  return { name, phone, email, street, city, postal, note };
}

export function validateOrder(body: Record<string, unknown>, products: ProductItem[]): Result {
  const lines = validateItems(body.items, products);
  const customer = validateCustomer(body.customer);
  if (!lines || !customer) return { ok: false };

  const totalRsd = lines.reduce((sum, line) => sum + line.quantity * line.unitRsd, 0);
  const totalEur = Math.round(lines.reduce((sum, line) => sum + line.quantity * line.unitEur, 0) * 100) / 100;

  return { ok: true, data: { customer, lines, totalRsd, totalEur } };
}