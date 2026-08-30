'use client';

import { HeroPropsInterface } from "@/types/home";

export default function Hero({
  eyebrow,
  headline,
  subheadline,
  ctaLabel,
  ctaLink,
}: HeroPropsInterface) {

  return (
    <section className="hero">
      {headline}
    </section>
  );
}
