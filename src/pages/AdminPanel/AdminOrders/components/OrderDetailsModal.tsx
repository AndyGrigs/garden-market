// src/pages/AdminPanel/AdminOrders/components/OrderDetailsModal.tsx
import { CURRENCY } from '@/config';
import { Order } from '@/types/IOrders';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderDetailsModal = ({ order, onClose }: OrderDetailsModalProps) => {
    const {t} = useTranslation();
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">
              {t('admin.orders.order')} {order.orderNumber}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Customer Info */}
            <div>
              <h4 className="font-semibold mb-2">{t('admin.orders.client')}:</h4>
              <p>{order.guestName}</p>
              <p>{order.guestEmail}</p>
              <p>{order.shippingAddress.phone}</p>
            </div>

            {/* Shipping Address */}
            <div>
              <h4 className="font-semibold mb-2">{t('admin.orders.shippingAddress')}</h4>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.country}
              </p>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="font-semibold mb-2">{t('admin.orders.items')}</h4>
              {order.items.map((item, index: number) => (
                <div key={index} className="flex justify-between py-2 border-b">
                  <span>
                    {item.title.ru} × {item.quantity}
                  </span>
                  <span>{item.subtotal.toFixed(2)} {CURRENCY}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold mt-2 text-lg">
                <span>{t('admin.orders.total')}</span>
                <span className="text-emerald-600">
                  {order.totalAmount.toFixed(2)} {CURRENCY}
                </span>
              </div>
            </div>

            {/* Customer Notes */}
            {order.customerNotes && (
              <div>
                <h4 className="font-semibold mb-2">{t('admin.orders.customerNotes')}</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {order.customerNotes}
                </p>
              </div>
            )}

            {/* Order Date */}
            <div>
              <h4 className="font-semibold mb-2">{t('admin.orders.orderDate')}</h4>
              <p className="text-gray-600">
                {new Date(order.createdAt).toLocaleString(t('common.locale'))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};