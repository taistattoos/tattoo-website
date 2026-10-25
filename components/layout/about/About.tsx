import Image from 'next/image';
import SplitText from '@/components/animations/SplitText';
import Eyebrow from '@/components/ui/Eyebrow';
import Markdown from '@/components/ui/Markdown';
import { ABOUT_LABELS } from '@/lib/constants/about';
import { getAbout } from '@/lib/content/content';
import type { AboutLocale } from '@/types/about';

export default function About({ locale }: { locale: AboutLocale }) {
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

          {about.specialties.length > 0 && (
            <div className='mt-12 border-t border-white/10 pt-8'>
              <Eyebrow text={labels.specialties} className='mb-6' />
              <ul className='space-y-6'>
                {about.specialties.map((item, index) => (
                  <li key={index}>
                    <h3 className='mb-1 text-lg text-white'>{item.title}</h3>
                    <p className='text-sm leading-relaxed text-white/50'>{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}