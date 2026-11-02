'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import { INITIAL_ORDER_FIELDS } from '@/lib/constants/shop';
import type { FormStatus } from '@/types/contact-form';
import type { OrderFields, OrderItem, ShopOrderContent } from '@/types/shop';

export function useOrderForm(content: ShopOrderContent, items: OrderItem[], onSuccess: () => void) {
  const [fields, setFields] = useState<OrderFields>(INITIAL_ORDER_FIELDS);
  const [honeypot, setHoneypot] = useState('');
  const [token, setToken] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [triedEmpty, setTriedEmpty] = useState(false);

  const turnstileRef = useRef<TurnstileInstance>(null);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  function setField(key: keyof OrderFields, value: string) {
    setFields((previous) => ({ ...previous, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending' || !token || !consent) return;

    if (items.length === 0) {
      setTriedEmpty(true);
      return;
    }

    setTriedEmpty(false);
    setStatus('sending');

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer: fields,
          trap: honeypot,
          turnstileToken: token,
          elapsedMs: Date.now() - startedAt.current,
          locale: content.locale,
          consent,
        }),
      });

      if (!response.ok) throw new Error('request failed');
      setStatus('success');
      onSuccess();
    } catch {
      setStatus('error');
      setToken('');
      turnstileRef.current?.reset();
    }
  }

  return {
    fields,
    setField,
    honeypot,
    setHoneypot,
    consent,
    setConsent,
    setToken,
    turnstileRef,
    status,
    showEmptyHint: triedEmpty && items.length === 0,
    canSubmit: Boolean(token) && consent && status !== 'sending',
    handleSubmit,
  };
}