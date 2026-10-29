import SplitText from '@/components/animations/SplitText';
import GalleryGrid from '@/components/layout/gallery/GalleryGrid';
import CTA from '@/components/ui/CTA';
import { getGalleryGridItems, getGalleryPage } from '@/lib/content/content';
import { LocaleEnum } from '@/types/enums';

export default function Gallery({ locale }: { locale: LocaleEnum }) {
  const page = getGalleryPage(locale);

  const featured = getGalleryGridItems(locale, true);
  const items = featured.length > 0 ? featured : getGalleryGridItems(locale);

  return (
    <section id='gallery' aria-labelledby='gallery-title' className='wrapper py-24'>
      {page.galleryHeading && (
        <SplitText
          as='h2'
          id='gallery-title'
          text={page.galleryHeading}
          by='words'
          stagger={0.08}
          className='mb-12 block text-4xl leading-tight text-white md:text-5xl'
        />
      )}

      <GalleryGrid items={items} />

      {page.galleryCta && (
        <div className='mt-12 text-center'>
          <CTA href={`/${locale}/gallery`} text={page.galleryCta} />
        </div>
      )}
    </section>
  );
}