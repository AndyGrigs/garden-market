export interface Tree {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  height: string;
  maintenance: 'Low' | 'Medium' | 'High';
}

export interface CartItem extends Tree {
  quantity: number;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}