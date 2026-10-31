'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import { getInitialAnswers, getMissingRequired, getVisibleAnswers, getVisibleQuestions } from '@/lib/utils/form';
import type { ContactFormContent, FormAnswers, FormStatus } from '@/types/contact-form';

export function useContactForm(content: ContactFormContent) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [answers, setAnswers] = useState<FormAnswers>(() => getInitialAnswers(content.questions));
  const [honeypot, setHoneypot] = useState('');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending' || !token) return;
    if (getMissingRequired(visibleQuestions, answers).length > 0) return;

    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          answers: getVisibleAnswers(visibleQuestions, answers),
          website: honeypot,
          turnstileToken: token,
          elapsedMs: Date.now() - startedAt.current,
          locale: content.locale,
        }),
      });

      if (!response.ok) throw new Error('request failed');
      setStatus('success');
    } catch {
      setStatus('error');
      setToken('');
      turnstileRef.current?.reset();
    }
  }

  return {
    name, setName,
    email, setEmail,
    answers, setAnswer,
    honeypot, setHoneypot,
    setToken,
    turnstileRef,
    status,
    canSubmit: Boolean(token) && status !== 'sending',
    visibleQuestions,
    handleSubmit,
  };
}