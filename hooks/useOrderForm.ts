'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import type { FormErrorCode } from '@/lib/constants/form-errors';
import { getFormErrorMessage, postForm } from '@/lib/utils/post-form';
import { INITIAL_ORDER_FIELDS } from '@/lib/constants/shop';
import type { FormStatus } from '@/types/contact-form';
import type { OrderFields, OrderItem, ShopOrderContent } from '@/types/shop';

export function useOrderForm(content: ShopOrderContent, items: OrderItem[], onSuccess: () => void) {
  const [fields, setFields] = useState<OrderFields>(INITIAL_ORDER_FIELDS);
  const [honeypot, setHoneypot] = useState('');
  const [token, setToken] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorCode, setErrorCode] = useState<FormErrorCode | null>(null);
  const [triedEmpty, setTriedEmpty] = useState(false);

  const turnstileRef = useRef<TurnstileInstance>(null);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  function setField(key: keyof OrderFields, value: string) {
    setFields((previous) => ({ ...previous, [key]: value }));
  }

  function handleToken(value: string) {
    setToken(value);
    // A fresh token means the spam check works again.
    if (value && errorCode === 'turnstile') {
      setErrorCode(null);
      setStatus('idle');
    }
  }

  function handleTurnstileFail() {
    setToken('');
    setErrorCode('turnstile');
    setStatus('error');
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
    setErrorCode(null);

    const result = await postForm('/api/order', {
      items,
      customer: fields,
      trap: honeypot,
      turnstileToken: token,
      elapsedMs: Date.now() - startedAt.current,
      locale: content.locale,
      consent,
    });

    if (result.ok) {
      setStatus('success');
      onSuccess();
      return;
    }

    setErrorCode(result.code);
    setStatus('error');
    // A used token can't be reused: get a fresh one for the next attempt.
    setToken('');
    turnstileRef.current?.reset();
  }

  return {
    fields,
    setField,
    honeypot,
    setHoneypot,
    consent,
    setConsent,
    setToken,
    handleToken,
    handleTurnstileFail,
    errorMessage: status === 'error' ? getFormErrorMessage(errorCode, content.locale, content.error) : '',
    turnstileRef,
    status,
    showEmptyHint: triedEmpty && items.length === 0,
    canSubmit: Boolean(token) && consent && status !== 'sending',
    handleSubmit,
  };
}