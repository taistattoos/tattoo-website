import type { LocaleEnum } from './enums';

type Localized<K extends string> = Record<`${K}_${LocaleEnum}`, string>;

export type BookingStepRaw = Localized<'title'> &
  Localized<'text'> &
  Partial<Localized<'image_alt'>> & {
    image?: string;
  };

export type BookingRaw = Localized<'title'> & {
  steps?: BookingStepRaw[];
};

export type BookingStep = {
  title: string;
  text: string;
  image?: string;
  imageAlt: string;
};

export type BookingContent = {
  title: string;
  steps: BookingStep[];
};
