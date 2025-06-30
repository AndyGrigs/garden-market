
export type Lang = 'ru' | 'ro' | 'en';

export type TranslatedString = {
  [key in Lang]?: string;
};

export interface Category {
  _id: string;
  name: TranslatedString;
  slug: string;
  imageUrl?: string; 
}
