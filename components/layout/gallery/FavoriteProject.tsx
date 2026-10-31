import Image from 'next/image';
import type { GalleryGridItemInterface } from '@/types/gallery';

export default function FavoriteProject({ item }: { item: GalleryGridItemInterface }) {
  return (
    <figure className='relative mb-12 aspect-4/3 overflow-hidden bg-neutral-900 md:aspect-video'>
      <Image
        src={item.image}
        alt={item.title}
        fill
        priority
        sizes='(max-width: 1920px) 100vw, 1920px'
        className='object-cover'
      />
      {item.title && (
        <figcaption className='absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-6 text-lg text-white md:p-10 md:text-2xl'>
          {item.title}
        </figcaption>
      )}
    </figure>
  );
}