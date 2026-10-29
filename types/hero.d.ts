export interface HeroPropsInterface {
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaLink: string;
  videoSrc: string;
  posterSrc?: string;
  overlay: number;
  grayscale: number;
}

type ContactMethod = 'form_now' | 'in_person' | 'whatsapp' | 'email_direct';
type Placement = 'arm' | 'leg' | 'elbow' | 'neck' | 'other' | '';
type ColorChoice = 'black' | 'gray' | 'red' | 'blue' | 'green' | 'other';