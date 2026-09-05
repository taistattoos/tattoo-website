export interface HeroPropsInterface {
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaLink: string;
};

type ContactMethod = 'form_now' | 'in_person' | 'whatsapp' | 'email_direct';
type Placement = 'arm' | 'leg' | 'elbow' | 'neck' | 'other' | '';
type ColorChoice = 'black' | 'gray' | 'red' | 'blue' | 'green' | 'other';

export interface FormStateInterface {
  name: string;
  email: string;
  contactMethod: ContactMethod;
  whatsappNumber: string;
  placement: Placement;
  placementOther: string;
  size: string;
  colors: ColorChoice[];
  message: string;
};
