import type { LocaleEnum } from './enums';

type Localized<K extends string> = Record<`${K}_${LocaleEnum}`, string>;

export type FaqItemRaw = Localized<'question'> & Localized<'answer'>;

export type FaqRaw = Localized<'title'> & {
  items?: FaqItemRaw[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqContent = {
  title: string;
  items: FaqItem[];
};