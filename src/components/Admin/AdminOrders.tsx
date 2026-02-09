import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from '@/store/api/orderApi';
import { Loader2, X, Eye, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { BASE_URL, CURRENCY } from '@/config';
import type { Order } from '@/types/IOrders';

const AdminOrders = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data, isLoading, refetch } = useGetAllOrdersQuery({
    page,
    limit: 20,
    status: statusFilter || undefined,
    paymentStatus: paymentFilter || undefined,
  });

  const [updateStatus] = useUpdateOrderStatusMutation();

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus({ id: orderId, status: newStatus }).unwrap();
      toast.success(t('admin.orders.statusUpdated'));
      refetch();
    } catch {
      toast.error(t('admin.orders.statusUpdateError'));
    }
  };

  const handlePaymentStatusChange = async (
    orderId: string,
    newPaymentStatus: string
  ) => {
    try {
      await updateStatus({
        id: orderId,
        paymentsStatus: newPaymentStatus,
      }).unwrap();
      toast.success(t('admin.orders.paymentStatusUpdated'));
      refetch();
    } catch {
      toast.error(t('admin.orders.paymentStatusUpdateError'));
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
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

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.orders.order')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.orders.client')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.orders.amount')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.orders.status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.orders.payment')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.orders.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('uk-UA')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {order.guestName || order.shippingAddress.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.guestEmail}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.shippingAddress.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">
                    {order.totalAmount.toFixed(2)} {CURRENCY}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                  >
                    <option value="awaiting_payment">{t('admin.orders.awaitingPayment')}</option>
                    <option value="paid">{t('admin.orders.paid')}</option>
                    <option value="processing">{t('admin.orders.processing')}</option>
                    <option value="shipped">{t('admin.orders.shipped')}</option>
                    <option value="delivered">{t('admin.orders.delivered')}</option>
                    <option value="cancelled">{t('admin.orders.cancelled')}</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={order.paymentStatus}
                    onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}
                  >
                    <option value="unpaid">{t('admin.orders.unpaid')}</option>
                    <option value="paid">{t('admin.orders.paid')}</option>
                    <option value="partial">{t('admin.orders.partial')}</option>
                    <option value="refunded">{t('admin.orders.refunded')}</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  {order.invoice?.pdfUrl && (
                    <a
                      href={`${BASE_URL}${order.invoice.pdfUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-900"
                    >
                      <Download className="h-5 w-5" />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-4 py-2 rounded ${
                page === pageNum
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {t('admin.orders.orderNumber', { orderNumber: selectedOrder.orderNumber })}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">{t('admin.orders.clientLabel')}</h4>
                  <p>{selectedOrder.guestName}</p>
                  <p>{selectedOrder.guestEmail}</p>
                  <p>{selectedOrder.shippingAddress.phone}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">{t('admin.orders.shippingAddress')}</h4>
                  <p>{selectedOrder.shippingAddress.address}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.country}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">{t('admin.orders.items')}</h4>
                  {selectedOrder.items.map((item, index: number) => (
                    <div key={index} className="flex justify-between py-2 border-b">
                      <span>{item.title.ru} × {item.quantity}</span>
                      <span>{item.subtotal.toFixed(2)} {CURRENCY}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold mt-2">
                    <span>{t('admin.orders.total')}</span>
                    <span>{selectedOrder.totalAmount.toFixed(2)} {CURRENCY}</span>
                  </div>
                </div>

                {selectedOrder.customerNotes && (
                  <div>
                    <h4 className="font-semibold mb-2">{t('admin.orders.customerNotes')}</h4>
                    <p className="text-gray-600">{selectedOrder.customerNotes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
