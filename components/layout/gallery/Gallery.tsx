import SplitText from '@/components/animations/SplitText';
import PinnedGallery from '@/components/layout/gallery/PinnedGallery';
import { getGalleryGridItems, getGalleryPage } from '@/lib/content/content';
import { LocaleEnum } from '@/types/enums';

export default function Gallery({ locale }: { locale: LocaleEnum }) {
  const page = getGalleryPage(locale);

  const featured = getGalleryGridItems(locale, true);
  const items = featured.length > 0 ? featured : getGalleryGridItems(locale);
  const galleryHref = `/${locale}/gallery`;

  if (items.length === 0) return null;

  return (
    <PinnedGallery
      items={items}
      ctaHref={galleryHref}
      ctaLabel={page.galleryCta}
      heading={
        page.galleryHeading && (
          <SplitText
            as='h2'
            id='gallery-title'
            text={page.galleryHeading}
            by='words'
            stagger={0.08}
            className='mb-12 block text-4xl leading-tight text-white md:text-5xl'
          />
        )
      }
    />
  );
}
