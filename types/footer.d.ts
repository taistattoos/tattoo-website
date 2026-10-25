import type { LocaleEnum } from './enums';

type Localized<K extends string> = Record<`${K}_${LocaleEnum}`, string>;

export type SocialPlatform = 'instagram' | 'threads' | 'telegram' | 'whatsapp' | 'email' | 'inkppl';

export interface SocialLinkInterface {
  platform: SocialPlatform;
  label: string;
  url: string;
}

export type FooterRaw = Localized<'tagline'> &
  Localized<'location'> & {
    copyright_name: string;
    socials?: SocialLinkInterface[];
  };

export type FooterContent = {
  tagline: string;
  location: string;
  copyrightName: string;
  socials: SocialLinkInterface[];
};