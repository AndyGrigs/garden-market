// Додай в інтерфейси після Notification
export interface PendingTree {
  _id: string;
  title: {
    ru: string;
    ro?: string;
  };
  description: {
    ru: string;
    ro?: string;
  };
  price: number;
  imageUrl?: string;
  category: {
    _id: string;
    title: { ru: string; ro?: string };
  };
  stock: number;
  seller: {
    _id: string;
    fullName: string;
    email: string;
    sellerInfo?: {
      nurseryName?: string;
    };
  };
  isApproved: boolean;
  createdAt: string;
}