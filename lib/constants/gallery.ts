import { LocaleEnum } from '@/types/enums';

// Gallery page: photos shown at first, and how many each "Load more" adds.
export const GALLERY_PAGE_SIZE = 12;

// Home page pinned gallery: most featured photos to show, so the sideways scroll stays a sensible length.
export const HOME_GALLERY_MAX = 10;

interface GalleryLabelsInterface {
  all: string;
  empty: string;
  loadMore: string;
  /** "{shown}" and "{total}" are replaced with numbers. */
  showing: string;
}

export const GALLERY_LABELS: Record<LocaleEnum, GalleryLabelsInterface> = {
  en: { all: 'All', empty: 'Gallery coming soon', loadMore: 'Load more', showing: 'Showing {shown} of {total}' },
  sr: { all: 'Sve', empty: 'Galerija uskoro', loadMore: 'Učitaj još', showing: 'Prikazano {shown} od {total}' },
  ru: { all: 'Все', empty: 'Галерея скоро появится', loadMore: 'Показать ещё', showing: 'Показано {shown} из {total}' },
};
