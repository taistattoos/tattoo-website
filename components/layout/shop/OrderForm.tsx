'use client';

import { BUTTON_CLASSES } from '@/lib/constants/ui';
import Link from 'next/link';
import FormAlert from '@/components/ui/FormAlert';
import FormTurnstile from '@/components/ui/FormTurnstile';
import { useOrderForm } from '@/hooks/useOrderForm';
import { inputClasses } from '@/lib/constants/contact-form';
import { ORDER_FIELDS } from '@/lib/constants/shop';
import type { OrderItem, ShopOrderContent } from '@/types/shop';

interface OrderFormProps {
  content: ShopOrderContent;
  items: OrderItem[];
  onSuccess: () => void;
}

export default function OrderForm({ content, items, onSuccess }: OrderFormProps) {
  const {
    fields,
    setField,
    honeypot,
    setHoneypot,
    consent,
    setConsent,
    handleToken,
    handleTurnstileFail,
    errorMessage,
    turnstileRef,
    status,
    showEmptyHint,
    canSubmit,
    handleSubmit,
  } = useOrderForm(content, items, onSuccess);

  if (status === 'success') {
    return (
      <p role='status' className='mt-16 border border-white/20 px-6 py-8 text-lg text-white'>
        {content.success}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className='relative mt-16 flex flex-col border-t border-white/10 pt-12'>
      <div aria-hidden='true' className='absolute -left-2499.75 h-0 w-0 overflow-hidden'>
        <label>
          Nickname
          <input
            type='text'
            name='nickname'
            tabIndex={-1}
            autoComplete='off'
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </label>
      </div>

      <h2 className='mb-8 text-2xl text-white'>{content.heading}</h2>

      <div className='grid gap-4 pb-6 sm:grid-cols-2'>
        {ORDER_FIELDS.map((field) => (
          <label
            key={field.key}
            className={`flex flex-col gap-1 text-sm text-white/70 ${field.wide ? 'sm:col-span-2' : ''}`}
          >
            {content[field.key]} *
            <input
              required
              type={field.type}
              autoComplete={field.autoComplete}
              maxLength={field.maxLength}
              pattern={field.pattern}
              inputMode={field.inputMode}
              value={fields[field.key]}
              onChange={(event) => setField(field.key, event.target.value)}
              className={inputClasses}
            />
          </label>
        ))}

        <label className='flex flex-col gap-1 text-sm text-white/70 sm:col-span-2'>
          {content.note}
          <textarea
            rows={3}
            maxLength={500}
            value={fields.note}
            onChange={(event) => setField('note', event.target.value)}
            className={inputClasses}
          />
        </label>
      </div>

      {content.deliveryNote && <p className='pb-6 text-sm leading-relaxed text-white/60'>{content.deliveryNote}</p>}

      <label className='flex cursor-pointer items-start gap-3 pb-6 text-sm text-white/70'>
        <input
          type='checkbox'
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          required
          className='mt-1 h-4 w-4 shrink-0 accent-white'
        />
        <span>
          {content.consentText}{' '}
          <Link
            href={`/${content.locale}/privacy`}
            target='_blank'
            className='text-white underline underline-offset-4 hover:text-white/70'
          >
            {content.consentLink}
          </Link>
        </span>
      </label>

      <FormTurnstile turnstileRef={turnstileRef} onToken={handleToken} onFail={handleTurnstileFail} />

      {showEmptyHint && (
        <p role='alert' className='mb-6 border border-white/30 px-4 py-3 text-sm text-white/80'>
          {content.emptyCart}
        </p>
      )}

      <FormAlert message={errorMessage} />

      <button
        type='submit'
        disabled={!canSubmit}
        className={`${BUTTON_CLASSES} self-start`}
      >
        {status === 'sending' ? content.sending : content.submit}
      </button>
    </form>
  );
}