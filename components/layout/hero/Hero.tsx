import { HeroPropsInterface } from '@/types/home';

export default function Hero({
  eyebrow,
  headline,
  subheadline,
  ctaLabel,
  ctaLink,
}: HeroPropsInterface) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-black">
      <video
        className="absolute inset-0 h-full w-full object-cover grayscale"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/assets/videos/tattoing-video.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 wrapper md:ml-auto mx-auto text-center md:text-right">
        {eyebrow && (
          <p className="mb-5 text-xs uppercase tracking-[0.25em] text-white/50">
            {eyebrow}
          </p>
        )}

        <h1 className="text-4xl uppercase leading-tight text-white sm:text-5xl lg:text-7xl">
          {headline}
        </h1>

        {subheadline && (
          <p className="mt-6 text-base leading-relaxed text-white/70">
            {subheadline}
          </p>
        )}

        {ctaLabel && (
          <div className="mt-10">
            <a
              href={ctaLink || '#contact'}
              className="inline-block rounded-full border border-white/30 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              {ctaLabel}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
