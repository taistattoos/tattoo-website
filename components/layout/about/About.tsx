import Image from 'next/image';
import SplitText from '@/components/animations/SplitText';
import AboutSpecialties from '@/components/layout/about/AboutSpecialties';
import Eyebrow from '@/components/ui/Eyebrow';
import Markdown from '@/components/ui/Markdown';
import { ABOUT_LABELS } from '@/lib/constants/about';
import { getAbout } from '@/lib/content/content';
import { LocaleEnum } from '@/types/enums';

export default function About({ locale }: { locale: LocaleEnum }) {
  const about = getAbout(locale);
  const labels = ABOUT_LABELS[locale];

  return (
    <section id='about' aria-labelledby='about-title' className='py-24'>
      <div className='wrapper grid items-center gap-12 md:grid-cols-2 md:gap-20'>
        <div className='relative aspect-4/5 bg-neutral-900'>
          <Image
            src={about.image}
            alt={about.imageAlt}
            fill
            sizes='(max-width: 768px) 100vw, 50vw'
            className='object-cover grayscale'
          />
        </div>

        <div>
          <Eyebrow text={labels.eyebrow} className='mb-4' />

          <SplitText
            as='h2'
            id='about-title'
            text={about.title}
            by='words'
            stagger={0.08}
            className='mb-8 block text-4xl leading-tight text-white md:text-5xl'
          />

          <Markdown>{about.body}</Markdown>
        </div>
      </div>

      <AboutSpecialties items={about.specialties} heading={labels.specialties} />
    </section>
  );
}