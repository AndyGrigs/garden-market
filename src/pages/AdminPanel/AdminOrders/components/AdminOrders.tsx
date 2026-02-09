import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, XCircle } from 'lucide-react';
import type { Order } from '@/types/IOrders';
import { OrderList } from './OrderList';
import { OrderDetailsModal } from './OrderDetailsModal';
import useAdminOrders from '../hooks/useAdminOrders';

const AdminOrders = () => {
  const { t } = useTranslation();
  const {
    orders,
    totalPages,
    currentPage,
    statusFilter,
    paymentFilter,
    isLoading,
    error,
    isProcessing,
    setPage,
    setStatusFilter,
    setPaymentFilter,
    handleStatusChange,
    handlePaymentStatusChange,
  } = useAdminOrders();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-800">
          <XCircle className="w-5 h-5" />
          <span>{t('admin.orders.errorItems')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('admin.orders.title')}</h2>
        <div className="flex space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">{t('admin.orders.allStatuses')}</option>
            <option value="awaiting_payment">{t('admin.orders.awaitingPayment')}</option>
            <option value="paid">{t('admin.orders.paid')}</option>
            <option value="processing">{t('admin.orders.processing')}</option>
            <option value="shipped">{t('admin.orders.shipped')}</option>
            <option value="delivered">{t('admin.orders.delivered')}</option>
            <option value="cancelled">{t('admin.orders.cancelled')}</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">{t('admin.orders.allPayments')}</option>
            <option value="unpaid">{t('admin.orders.unpaid')}</option>
            <option value="paid">{t('admin.orders.paid')}</option>
          </select>
        </div>
      </div>

      <OrderList
        orders={orders}
        onStatusChange={handleStatusChange}
        onPaymentStatusChange={handlePaymentStatusChange}
        onViewDetails={(order) => setSelectedOrder(order)}
        isProcessing={isProcessing}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-4 py-2 rounded ${
                currentPage === pageNum
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};

export default AdminOrders;
