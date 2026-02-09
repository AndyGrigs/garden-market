// src/pages/AdminPanel/AdminOrders/components/OrderList.tsx
import { Order } from '@/types/IOrders';
import { OrderCard } from './OrderCard';
import { Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface OrderListProps {
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: string) => void;
  onPaymentStatusChange: (orderId: string, newPaymentStatus: string) => void;
  onViewDetails: (order: Order) => void;
  isProcessing: boolean;
}

export const OrderList = ({
  orders,
  onStatusChange,
  onPaymentStatusChange,
  onViewDetails,
  isProcessing,
}: OrderListProps) => {
  const { t } = useTranslation();

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">{t('admin.orders.noOrders')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          onStatusChange={onStatusChange}
          onPaymentStatusChange={onPaymentStatusChange}
          onViewDetails={onViewDetails}
          isProcessing={isProcessing}
        />
      ))}
    </div>
  );
};