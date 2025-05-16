import { Tree } from "./types/ITree";

export interface CartItem extends Tree {
  quantity: number;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}