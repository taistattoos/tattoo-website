import SplitText from '@/components/animations/SplitText';
import CTA from '@/components/ui/CTA';
import Eyebrow from '@/components/ui/Eyebrow';
import { HeroPropsInterface } from '@/types/home';

export default function Hero({ eyebrow, headline, subheadline, ctaLabel, ctaLink }: HeroPropsInterface) {
  return (
    <section className='relative flex min-h-screen items-center overflow-hidden bg-black'>
      <video className='absolute inset-0 h-full w-full object-cover grayscale' autoPlay muted loop playsInline>
        <source src='/assets/videos/tattoing-video.mp4' type='video/mp4' />
      </video>

      <div className='absolute inset-0 bg-black/60' />

      <div className='relative z-10 wrapper md:ml-auto mx-auto text-center md:text-right'>
        {eyebrow && <Eyebrow text={eyebrow} className='mb-4' />}

        {headline && (
          <SplitText
            as='h1'
            text={headline}
            trigger='mount'
            stagger={0.08}
            className='max-w-175 ml-auto xs:text-6xl text-4xl uppercase leading-tight text-white sm:text-7xl lg:text-9xl font-bold'
          />
        )}
        
        {subheadline && <p className='mt-6 text-base leading-relaxed text-white/70'>{subheadline}</p>}

        {ctaLabel && <CTA className='mt-10' href={ctaLink || '#contact'} text={ctaLabel} />}
      </div>
    </section>
  );
}
