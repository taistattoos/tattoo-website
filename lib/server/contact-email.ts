import type { ContactFormContent, FormAnswers } from '@/types/contact-form';
import type { ContactSubmission } from '@/lib/server/contact-validation';

export interface AnswerLine {
  label: string;
  value: string;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function getAnswerLines(content: ContactFormContent, answers: FormAnswers): AnswerLine[] {
  return content.questions
    .filter((question) => question.key in answers)
    .map((question) => {
      const value = answers[question.key];
      const list = Array.isArray(value) ? value : [value];
      const labels = list
        .filter(Boolean)
        .map((item) => question.options.find((option) => option.value === item)?.label ?? item);
      return { label: question.label, value: labels.join(', ') };
    })
    .filter((line) => line.value !== '');
}

export function buildOwnerEmail(submission: ContactSubmission, lines: AnswerLine[], locale: string) {
  const rows: AnswerLine[] = [
    { label: 'Name', value: submission.name },
    { label: 'Email', value: submission.email },
    { label: 'Language', value: locale.toUpperCase() },
    ...lines,
  ];

  const text = rows.map((row) => `${row.label}: ${row.value}`).join('\n\n');

  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0;color:#111">
  <h2 style="margin:0 0 20px">New tattoo inquiry</h2>
  ${rows
    .map(
      (row) =>
        `<p style="margin:0 0 16px"><strong style="display:block;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#666">${escapeHtml(row.label)}</strong>${escapeHtml(row.value).replace(/\n/g, '<br>')}</p>`,
    )
    .join('')}
  </div>`;

  return { subject: `New inquiry from ${submission.name}`, text, html };
}
