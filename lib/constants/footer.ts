import { LocaleEnum } from '@/types/enums';

export const FOOTER_LABELS: Record<
  LocaleEnum,
  { rights: string; follow: string; sections: string; privacy: string }
> = {
  en: { rights: 'All rights reserved.', follow: 'Follow', sections: 'Explore', privacy: 'Privacy Policy' },
  sr: { rights: 'Sva prava zadržana.', follow: 'Pratite', sections: 'Istražite', privacy: 'Politika privatnosti' },
  ru: {
    rights: 'Все права защищены.',
    follow: 'Подписывайтесь',
    sections: 'Разделы',
    privacy: 'Политика конфиденциальности',
  },
};