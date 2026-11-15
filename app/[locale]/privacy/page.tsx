import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import SplitText from '@/components/animations/SplitText';
import Markdown from '@/components/ui/Markdown';
import { LEGAL_LABELS } from '@/lib/constants/legal';
import { getPrivacyPage, getSite } from '@/lib/content/content';
import { LocaleEnum } from '@/types/enums';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const page = getPrivacyPage(locale as LocaleEnum);

  return pageMetadata({ locale, path: '/privacy', title: page.title });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const page = getPrivacyPage(locale as LocaleEnum);
  const email = getSite().contact_email;
  const labels = LEGAL_LABELS[locale] ?? LEGAL_LABELS.en;

  return (
    <main className='wrapper pb-24 pt-32'>
      <SplitText
        as='h1'
        text={page.title}
        by='words'
        stagger={0.08}
        trigger='mount'
        reveal='focus'
        className='mb-4 block text-4xl leading-tight text-white md:text-5xl'
      />
      {page.updated && (
        <p className='mb-10 text-sm text-white/40'>
          {labels.updated}: {page.updated}
        </p>
      )}
      <Markdown>{page.body}</Markdown>
      {email && (
        <p className='mt-10 text-white/70'>
          {labels.contact}:{' '}
          <a href={`mailto:${email}`} className='text-white underline underline-offset-4'>
            {email}
          </a>
        </p>
      )}
    </main>
  );
}