import { TranslatedString } from './ITree';

export interface Review {
  _id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  type: 'product' | 'website';
  productId?: string;
  productName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewFormData {
  name: TranslatedString;
  rating: number;
  comment: string;
  type: 'product' | 'website';
  productId?: string;
}