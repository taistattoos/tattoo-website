import SplitText from '@/components/animations/SplitText';
import CTA from '@/components/ui/CTA';
import Eyebrow from '@/components/ui/Eyebrow';
import { HeroPropsInterface } from '@/types/hero';

export default function Hero({
  eyebrow,
  headline,
  subheadline,
  ctaLabel,
  ctaLink,
  videoSrc,
  posterSrc,
  overlay,
  grayscale,
}: HeroPropsInterface) {
  return (
    <section className='relative flex min-h-screen items-center overflow-hidden bg-black'>
      {/* Decorative background: the poster paints instantly while the video loads. */}
      <video
        className='absolute inset-0 h-full w-full object-cover'
        style={{ filter: `grayscale(${grayscale}%)` }}
        poster={posterSrc}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden='true'
      >
        <source src={videoSrc} type='video/mp4' />
      </video>

      <div className='absolute inset-0 bg-black' style={{ opacity: overlay / 100 }} />

      <div className='relative z-10 wrapper md:ml-auto mx-auto text-center md:text-right'>
        {/* The eyebrow sits inside the h1 so the main heading carries "tattoo artist" and the cities, not just the name. */}
        <h1>
          {eyebrow && <Eyebrow text={eyebrow} className='mb-4' />}

          {headline && (
            <SplitText
              text={headline}
              trigger='mount'
              stagger={0.08}
              reveal='focus'
              className='block max-w-175 ml-auto xs:text-6xl text-4xl uppercase leading-tight text-white sm:text-7xl lg:text-9xl font-bold'
            />
          )}
        </h1>
        
        {subheadline && <p className='mt-6 text-base leading-relaxed text-white/70'>{subheadline}</p>}

        {ctaLabel && <CTA className='mt-10' href={ctaLink || '#contact'} text={ctaLabel} />}
      </div>
    </section>
  );
}
