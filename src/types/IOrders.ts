// export interface OrderItem {
//   productId: string;
//   productName: string;
//   quantity: number;
//   price: number;
//   imageUrl?: string;
// }

// export interface Order {
//   _id: string;
//   userId: string;
//   items: OrderItem[];
//   totalAmount: number;
//   status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
//   shippingAddress: {
//     street: string;
//     city: string;
//     postalCode: string;
//     country: string;
//   };
//   createdAt: string;
//   updatedAt: string;
// } 

export interface Order {
  _id: string;
  orderNumber: string;
  userId?: string;
  guestEmail?: string;
  guestName?: string;
  items: Array<{
    treeId: string;
    title: {
      ru: string;
      ro: string;
    };
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  totalAmount: number;
  currency: string;
  status: 'awaiting_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'partial' | 'refunded';
  paymentMethod: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode?: string;
  };
  invoice?: {
    number: string;
    pdfUrl: string;
    sentAt: Date;
    sentTo: string;
  };
  customerNotes?: string;
  adminNotes?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderRequest {
  userId?: string;
  items: Array<{
    treeId: string;
    title: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  shippingAddress: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    country: string;
    postalCode?: string;
  };
  customerNotes?: string;
  language?: string;
}