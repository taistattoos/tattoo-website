'use client';

import { ChangeEvent, useMemo, useState } from 'react';
import { getInitialAnswers, getMissingRequired, getVisibleAnswers, getVisibleQuestions } from '@/lib/utils/form';
import type { ContactFormContent, FormAnswers } from '@/types/contact-form';

export function useContactForm(content: ContactFormContent) {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [answers, setAnswers] = useState<FormAnswers>(() => getInitialAnswers(content.questions));

  const visibleQuestions = useMemo(
    () => getVisibleQuestions(content.questions, answers),
    [content.questions, answers],
  );

  function setAnswer(key: string, value: string | string[]) {
    setAnswers((previous) => ({ ...previous, [key]: value }));
  }

  function handleSubmit(event: ChangeEvent<HTMLFormElement>) {
    event.preventDefault();

    const missing = getMissingRequired(visibleQuestions, answers);
    if (missing.length > 0) return;

    console.log('form', { name, email, answers: getVisibleAnswers(visibleQuestions, answers) });
  }

  return { name, setName, email, setEmail, answers, setAnswer, visibleQuestions, handleSubmit };
}