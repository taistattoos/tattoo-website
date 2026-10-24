import SplitText from '@/components/animations/SplitText';
import CTA from '@/components/ui/CTA';
import { HeroPropsInterface } from '@/types/home';

export default function Hero({ eyebrow, headline, subheadline, ctaLabel, ctaLink }: HeroPropsInterface) {
  return (
    <section className='relative flex min-h-screen items-center overflow-hidden bg-black'>
      <video className='absolute inset-0 h-full w-full object-cover grayscale' autoPlay muted loop playsInline>
        <source src='/assets/videos/tattoing-video.mp4' type='video/mp4' />
      </video>

      <div className='absolute inset-0 bg-black/60' />

      <div className='relative z-10 wrapper md:ml-auto mx-auto text-center md:text-right'>
        {eyebrow && <p className='mb-5 text-xs uppercase tracking-[0.25em] text-white/50'>{eyebrow}</p>}

        <SplitText
          as='h1'
          text={headline}
          trigger='mount'
          stagger={0.08}
          className='text-4xl uppercase leading-tight text-white sm:text-5xl lg:text-9xl font-bold'
        />

        {subheadline && <p className='mt-6 text-base leading-relaxed text-white/70'>{subheadline}</p>}

        {ctaLabel && <CTA className='mt-10' href={ctaLink || '#contact'} text={ctaLabel} />}
      </div>
    </section>
  );
}
