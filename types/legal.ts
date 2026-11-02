export interface LegalPageRaw {
  title_en?: string;
  title_sr?: string;
  title_ru?: string;
  body_en?: string;
  body_sr?: string;
  body_ru?: string;
  updated?: string | Date;
}

export interface LegalPageContent {
  title: string;
  body: string;
  updated: string;
}