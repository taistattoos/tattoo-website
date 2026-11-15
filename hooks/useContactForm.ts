'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import type { FormErrorCode } from '@/lib/constants/form-errors';
import { getFormErrorMessage, postForm } from '@/lib/utils/post-form';
import { getInitialAnswers, getMissingRequired, getVisibleAnswers, getVisibleQuestions } from '@/lib/utils/form';
import type { ContactFormContent, FormAnswers, FormStatus } from '@/types/contact-form';

export function useContactForm(content: ContactFormContent) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [answers, setAnswers] = useState<FormAnswers>(() => getInitialAnswers(content.questions));
  const [honeypot, setHoneypot] = useState('');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorCode, setErrorCode] = useState<FormErrorCode | null>(null);
  const [consent, setConsent] = useState(false);

  const turnstileRef = useRef<TurnstileInstance>(null);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const visibleQuestions = useMemo(
    () => getVisibleQuestions(content.questions, answers),
    [content.questions, answers],
  );

  function setAnswer(key: string, value: string | string[]) {
    setAnswers((previous) => ({ ...previous, [key]: value }));
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
    if (getMissingRequired(visibleQuestions, answers).length > 0) return;

    setStatus('sending');
    setErrorCode(null);

    const result = await postForm('/api/contact', {
      name,
      email,
      answers: getVisibleAnswers(visibleQuestions, answers),
      website: honeypot,
      turnstileToken: token,
      elapsedMs: Date.now() - startedAt.current,
      locale: content.locale,
      consent,
    });

    if (result.ok) {
      setStatus('success');
      return;
    }

    setErrorCode(result.code);
    setStatus('error');
    // A used token can't be reused: get a fresh one for the next attempt.
    setToken('');
    turnstileRef.current?.reset();
  }

  return {
    name, setName,
    email, setEmail,
    answers, setAnswer,
    honeypot, setHoneypot,
    consent, setConsent,
    setToken,
    handleToken,
    handleTurnstileFail,
    errorMessage: status === 'error' ? getFormErrorMessage(errorCode, content.locale, content.error) : '',
    turnstileRef,
    status,
    canSubmit: Boolean(token) && consent && status !== 'sending',
    visibleQuestions,
    handleSubmit,
  };
}