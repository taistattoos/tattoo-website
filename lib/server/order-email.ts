import { escapeHtml } from '@/lib/server/contact-email';
import { formatPrice } from '@/lib/utils/price';
import type { LocaleEnum } from '@/types/enums';
import type { ShopOrderContent, ValidatedOrder } from '@/types/shop';

const WRAPPER = 'font-family:Arial,sans-serif;max-width:560px;margin:0;color:#111';
const LABEL = 'display:block;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#666';

function multiline(text: string): string {
  return escapeHtml(text).replace(/\n/g, '<br>');
}

function totalText(order: ValidatedOrder, locale: LocaleEnum): string {
  return `${formatPrice(order.totalRsd, 'RSD', locale)} (${formatPrice(order.totalEur, 'EUR', locale)})`;
}

function summary(order: ValidatedOrder, locale: LocaleEnum, names: Map<string, string>, totalLabel: string) {
  const items = order.lines.map((line) => ({
    name: names.get(line.slug) ?? line.name,
    quantity: line.quantity,
    price: formatPrice(line.quantity * line.unitRsd, 'RSD', locale),
  }));

  const text = [
    ...items.map((item) => `${item.quantity} x ${item.name} - ${item.price}`),
    '',
    `${totalLabel}: ${totalText(order, locale)}`,
  ].join('\n');

  const html = `<table style="width:100%;border-collapse:collapse;margin:0 0 8px">
  ${items
    .map(
      (item) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${item.quantity} &times; ${escapeHtml(item.name)}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${escapeHtml(item.price)}</td></tr>`,
    )
    .join('')}
  <tr><td style="padding:10px 0"><strong>${escapeHtml(totalLabel)}</strong></td><td style="padding:10px 0;text-align:right"><strong>${escapeHtml(totalText(order, locale))}</strong></td></tr>
  </table>`;

  return { text, html };
}

function addressLines(order: ValidatedOrder): string[] {
  const { street, postal, city } = order.customer;
  return [street, `${postal} ${city}`, 'Serbia'];
}

export function buildOwnerOrderEmail(order: ValidatedOrder, locale: LocaleEnum, names: Map<string, string>) {
  const { customer } = order;
  const items = summary(order, 'en' as LocaleEnum, names, 'Total');

  const details = [
    { label: 'Name', value: customer.name },
    { label: 'Phone', value: customer.phone },
    { label: 'Email', value: customer.email },
    { label: 'Address', value: addressLines(order).join('\n') },
    { label: 'Language', value: locale.toUpperCase() },
    ...(customer.note ? [{ label: 'Note', value: customer.note }] : []),
  ];

  const text = [items.text, ...details.map((row) => `${row.label}: ${row.value}`)].join('\n\n');

  const html = `<div style="${WRAPPER}">
  <h2 style="margin:0 0 20px">New sticker order</h2>
  ${items.html}
  ${details
    .map(
      (row) =>
        `<p style="margin:16px 0 0"><strong style="${LABEL}">${escapeHtml(row.label)}</strong>${multiline(row.value)}</p>`,
    )
    .join('')}
  </div>`;

  return { subject: `New sticker order from ${customer.name}`, text, html };
}

export function buildCustomerOrderEmail(
  order: ValidatedOrder,
  locale: LocaleEnum,
  names: Map<string, string>,
  content: ShopOrderContent,
) {
  const items = summary(order, locale, names, content.total);

  const text = [content.confirmIntro, items.text, content.deliveryNote, content.confirmOutro]
    .filter(Boolean)
    .join('\n\n');

  const html = `<div style="${WRAPPER}">
  <p style="margin:0 0 20px">${multiline(content.confirmIntro)}</p>
  ${items.html}
  ${content.deliveryNote ? `<p style="margin:16px 0 0;color:#666">${multiline(content.deliveryNote)}</p>` : ''}
  <p style="margin:24px 0 0">${multiline(content.confirmOutro)}</p>
  </div>`;

  return { subject: content.confirmSubject, text, html };
}