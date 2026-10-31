import { LocaleEnum } from '@/types/enums';

export type FormQuestionType = 'text' | 'textarea' | 'tel' | 'select' | 'radio' | 'checkboxes';

export interface ContactFormOptionRaw {
  value: string;
  label_en: string;
  label_sr?: string;
  label_ru?: string;
}

export interface ContactFormQuestionRaw {
  key: string;
  type: FormQuestionType;
  label_en: string;
  label_sr?: string;
  label_ru?: string;
  placeholder_en?: string;
  placeholder_sr?: string;
  placeholder_ru?: string;
  required?: boolean;
  options?: ContactFormOptionRaw[];
  show_if_field?: string;
  show_if_value?: string;
}

export interface ContactFormRaw {
  name_label_en: string;
  name_label_sr?: string;
  name_label_ru?: string;
  email_label_en: string;
  email_label_sr?: string;
  email_label_ru?: string;
  submit_en: string;
  submit_sr?: string;
  submit_ru?: string;
  sending_en: string;
  sending_sr?: string;
  sending_ru?: string;
  success_en: string;
  success_sr?: string;
  success_ru?: string;
  error_en: string;
  error_sr?: string;
  error_ru?: string;
  questions?: ContactFormQuestionRaw[];
}

export interface FormOption {
  value: string;
  label: string;
}

export interface FormQuestion {
  key: string;
  type: FormQuestionType;
  label: string;
  placeholder?: string;
  required: boolean;
  options: FormOption[];
  showIf?: { field: string; value: string };
}

export interface ContactFormContent {
  locale: LocaleEnum,
  nameLabel: string;
  emailLabel: string;
  submit: string;
  sending: string;
  success: string;
  error: string;
  questions: FormQuestion[];
}

export type FormAnswers = Record<string, string | string[]>;



export type FormStatus = 'idle' | 'sending' | 'success' | 'error';