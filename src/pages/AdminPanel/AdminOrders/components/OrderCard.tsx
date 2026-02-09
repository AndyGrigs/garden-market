// src/pages/AdminPanel/AdminOrders/components/OrderCard.tsx
import { Order } from '@/types/IOrders';
import { Eye, Download } from 'lucide-react';
import { BASE_URL } from '@/config';
import { useTranslation } from 'react-i18next';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: string) => void;
  onPaymentStatusChange: (orderId: string, newPaymentStatus: string) => void;
  onViewDetails: (order: Order) => void;
  isProcessing: boolean;
}

export const OrderCard = ({
  order,
  onStatusChange,
  onPaymentStatusChange,
  onViewDetails,
  isProcessing,
}: OrderCardProps) => {
  const { t } = useTranslation();
  
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      awaiting_payment: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      unpaid: 'bg-red-100 text-red-800',
      paid: 'bg-green-100 text-green-800',
      partial: 'bg-yellow-100 text-yellow-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
        {/* Order Number */}
        <div>
          <p className="text-sm text-gray-500">{t('admin.orders.number', { defaultValue: 'Номер' })}</p>
          <p className="font-semibold">{order.orderNumber}</p>
        </div>

        {/* Customer */}
        <div>
          <p className="text-sm text-gray-500">{t('admin.orders.client', { defaultValue: 'Клієнт' })}</p>
          <p className="font-medium">{order.guestName}</p>
          <p className="text-xs text-gray-500">{order.guestEmail}</p>
        </div>

        {/* Total */}
        <div>
          <p className="text-sm text-gray-500">{t('admin.orders.amount', { defaultValue: 'Сума' })}</p>
          <p className="font-semibold text-emerald-600">
            {order.totalAmount.toFixed(2)} MDL
          </p>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm text-gray-500 mb-1">{t('admin.orders.status', { defaultValue: 'Статус' })}</p>
          <select
            value={order.status}
            onChange={(e) => onStatusChange(order._id, e.target.value)}
            disabled={isProcessing}
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              order.status
            )} disabled:opacity-50`}
          >
            <option value="awaiting_payment">{t('admin.orders.awaitingPayment', { defaultValue: 'Очікує оплати' })}</option>
            <option value="paid">{t('admin.orders.paid', { defaultValue: 'Оплачено' })}</option>
            <option value="processing">{t('admin.orders.processing', { defaultValue: 'Обробка' })}</option>
            <option value="shipped">{t('admin.orders.shipped', { defaultValue: 'Відправлено' })}</option>
            <option value="delivered">{t('admin.orders.delivered', { defaultValue: 'Доставлено' })}</option>
            <option value="cancelled">{t('admin.orders.cancelled', { defaultValue: 'Скасовано' })}</option>
          </select>
        </div>

        {/* Payment Status */}
        <div>
          <p className="text-sm text-gray-500 mb-1">{t('admin.orders.payment', { defaultValue: 'Оплата' })}</p>
          <select
            value={order.paymentsStatus}
            onChange={(e) => onPaymentStatusChange(order._id, e.target.value)}
            disabled={isProcessing}
            className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
              order.paymentsStatus
            )} disabled:opacity-50`}
          >
            <option value="unpaid">{t('admin.orders.unpaid', { defaultValue: 'Не оплачено' })}</option>
            <option value="paid">{t('admin.orders.paid', { defaultValue: 'Оплачено' })}</option>
            <option value="partial">{t('admin.orders.partial', { defaultValue: 'Частково' })}</option>
            <option value="refunded">{t('admin.orders.refunded', { defaultValue: 'Повернуто' })}</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(order)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title={t('admin.orders.viewDetails', { defaultValue: 'Переглянути деталі' })}
          >
            <Eye className="h-5 w-5" />
          </button>
          {order.invoice && (
            <a
              href={`${BASE_URL}${order.invoice}`}
              download
              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title={t('admin.orders.downloadInvoice', { defaultValue: 'Завантажити рахунок' })}
            >
              <Download className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};