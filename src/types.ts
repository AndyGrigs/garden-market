export interface Tree {
  _id: string;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock: number;
  category?: {
    _id: string;
    name: string;
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