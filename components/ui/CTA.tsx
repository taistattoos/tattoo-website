type CTAPropsInterface = {
  text: string;
  href: string;
  className?: string;
};

export default function CTA({ text, href, className }: CTAPropsInterface) {
  return (
    <a className={`${className} inline-block rounded-full border border-white/30 px-8 py-3 text-sm font-medium text-white hover:text-black transition-colors duration-200 hover:bg-white`} href={href}>
      {text}
    </a>
  );
}
