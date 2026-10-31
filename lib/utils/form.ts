import type { FormAnswers, FormQuestion } from '@/types/contact-form';

/** Radios start on their first option, checkboxes empty, everything else blank. */
export function getInitialAnswers(questions: FormQuestion[]): FormAnswers {
  return Object.fromEntries(
    questions.map((question) => {
      if (question.type === 'checkboxes') return [question.key, []];
      if (question.type === 'radio') return [question.key, question.options[0]?.value ?? ''];
      return [question.key, ''];
    }),
  );
}

function isVisible(
  question: FormQuestion,
  questions: FormQuestion[],
  answers: FormAnswers,
  seen: Set<string> = new Set(),
): boolean {
  if (!question.showIf) return true;
  if (seen.has(question.key)) return false; // circular rule, hide instead of looping

  const parent = questions.find((item) => item.key === question.showIf?.field);
  if (!parent) return true; // rule points at a deleted question, so show it rather than lose it

  // A question is hidden whenever its parent is hidden
  if (!isVisible(parent, questions, answers, new Set(seen).add(question.key))) return false;

  const value = answers[parent.key];
  return Array.isArray(value) ? value.includes(question.showIf.value) : value === question.showIf.value;
}

export function getVisibleQuestions(questions: FormQuestion[], answers: FormAnswers): FormQuestion[] {
  return questions.filter((question) => isVisible(question, questions, answers));
}

/** Keys of visible, required questions that have no answer. */
export function getMissingRequired(visibleQuestions: FormQuestion[], answers: FormAnswers): string[] {
  return visibleQuestions
    .filter((question) => question.required)
    .filter((question) => {
      const value = answers[question.key];
      return Array.isArray(value) ? value.length === 0 : !value?.trim();
    })
    .map((question) => question.key);
}

/** Only the answers of questions the visitor could actually see. */
export function getVisibleAnswers(visibleQuestions: FormQuestion[], answers: FormAnswers): FormAnswers {
  return Object.fromEntries(visibleQuestions.map((question) => [question.key, answers[question.key]]));
}