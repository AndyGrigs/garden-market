export type NotificationType =
  | 'new_seller_registration'
  | 'new_product_created'
  | 'tree_approved'
  | 'order_placed'
  | 'order_cancelled'
  | 'other';

export interface Notification {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  data?: {
    userId?: string;
    productId?: string;
    orderId?: string;
    treeName?: string;
    sellerName?: string;
    sellerInfo?: {
      nurseryName?: string;
      email?: string;
      fullName?: string;
    };
    [key: string]: unknown;
  };
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  unreadCount: number;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export interface CreateNotificationRequest {
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}
