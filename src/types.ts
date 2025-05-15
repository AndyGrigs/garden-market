export type TranslatedString = {
  ru: string;
  ro: string;
  en: string;
};

export interface TreeFormData {
  title: { ru: string; ro: string; en: string };
  description: { ru: string; ro: string; en: string };
  price: number;
  stock: number;
  category: string; // id категорії
  imageUrl?: string;
}

export interface Tree {
  _id: string;
  title: TranslatedString;
  description: TranslatedString;
  price: number;
  imageUrl?: string;
  stock: number;
  category?: {
    _id: string;
    name: TranslatedString;
  } | null;
}

export interface CartItem extends Tree {
  quantity: number;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}