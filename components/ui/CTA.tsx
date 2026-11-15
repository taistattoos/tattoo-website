import { BUTTON_CLASSES } from '@/lib/constants/ui';

type CTAPropsInterface = {
  text: string;
  href: string;
  className?: string;
};

export default function CTA({ text, href, className = '' }: CTAPropsInterface) {
  return (
    <a className={`${BUTTON_CLASSES} ${className}`} href={href}>
      {text}
    </a>
  );
}
