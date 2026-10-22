export type AboutLocale = 'en' | 'sr' | 'ru';

type Localized<K extends string> = Record<`${K}_${AboutLocale}`, string>;

export type AboutRaw = Localized<'title'> &
  Localized<'body'> &
  Localized<'image_alt'> & {
    image: string;
  };

export type AboutContent = {
  title: string;
  body: string;
  image: string;
  imageAlt: string;
};