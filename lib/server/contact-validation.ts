import { CONTACT_LIMITS } from '@/lib/constants/contact-api';
import { isValidEmail } from '@/lib/server/email-address';
import { getMissingRequired, getVisibleAnswers, getVisibleQuestions } from '@/lib/utils/form';
import type { ContactFormContent, FormAnswers } from '@/types/contact-form';

export interface ContactSubmission {
  name: string;
  email: string;
  answers: FormAnswers;
}

export type ValidationResult = { ok: true; data: ContactSubmission } | { ok: false; error: string };

const fail = (error: string): ValidationResult => ({ ok: false, error });

function clean(value: unknown, max: number, multiline = false): string | null {
  if (typeof value !== 'string') return null;

  const controlChars = multiline ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g;
  const text = value.replace(/\r\n/g, '\n').replace(controlChars, ' ').trim();

  return text.length <= max ? text : null;
}

export function validateSubmission(body: unknown, content: ContactFormContent): ValidationResult {
  if (!body || typeof body !== 'object') return fail('body');

  const { name, email, answers } = body as Record<string, unknown>;

  const cleanName = clean(name, CONTACT_LIMITS.name);
  if (!cleanName) return fail('name');

  const cleanEmail = clean(email, CONTACT_LIMITS.email);
  if (!cleanEmail || !isValidEmail(cleanEmail)) return fail('email');

  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) return fail('answers');
  const raw = answers as Record<string, unknown>;

  const cleaned: FormAnswers = {};

  for (const question of content.questions) {
    const value = raw[question.key];
    const allowed = question.options.map((option) => option.value);

    if (question.type === 'checkboxes') {
      const list = Array.isArray(value) ? value : [];
      const valid = list.every((item) => typeof item === 'string' && allowed.includes(item));
      if (!valid || list.length > allowed.length) return fail(question.key);
      cleaned[question.key] = list as string[];
    } else if (question.type === 'radio' || question.type === 'select') {
      const text = typeof value === 'string' ? value : '';
      if (text !== '' && !allowed.includes(text)) return fail(question.key);
      cleaned[question.key] = text;
    } else {
      const multiline = question.type === 'textarea';
      const max = multiline ? CONTACT_LIMITS.longText : CONTACT_LIMITS.shortText;
      const text = clean(value ?? '', max, multiline);
      if (text === null) return fail(question.key);
      cleaned[question.key] = text;
    }
  }

  const visible = getVisibleQuestions(content.questions, cleaned);
  if (getMissingRequired(visible, cleaned).length > 0) return fail('required');

  return {
    ok: true,
    data: { name: cleanName, email: cleanEmail, answers: getVisibleAnswers(visible, cleaned) },
  };
}