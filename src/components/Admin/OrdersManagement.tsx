import { useState } from 'react';
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from '@/store/api/orderApi';
import { motion } from 'framer-motion';
import { Loader2, Check, X, Eye, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { BASE_URL } from '@/config';

const OrdersManagement = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

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
      toast.success('Статус оновлено');
      refetch();
    } catch (error) {
      toast.error('Помилка оновлення статусу');
    }
  };

  const handlePaymentStatusChange = async (
    orderId: string,
    newPaymentStatus: string
  ) => {
    try {
      await updateStatus({
        id: orderId,
        paymentStatus: newPaymentStatus,
      }).unwrap();
      toast.success('Статус оплати оновлено');
      refetch();
    } catch (error) {
      toast.error('Помилка оновлення статусу оплати');
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
        <h2 className="text-2xl font-bold">Управление заказами</h2>
        <div className="flex space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Всі статуси</option>
            <option value="awaiting_payment">Очікує оплати</option>
            <option value="paid">Оплачено</option>
            <option value="processing">Обробляється</option>
            <option value="shipped">Відправлено</option>
            <option value="delivered">Доставлено</option>
            <option value="cancelled">Скасовано</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Всі оплати</option>
            <option value="unpaid">Не оплачено</option>
            <option value="paid">Оплачено</option>
          </select>
        </div>
      </div>
      
       {/**Orders Table */}
      <div className='bg-white rounded-lg shadow overflow-hidden'>
        <table className='min-w-full divide-y divide-gray-200'>

        </table>
      </div>
    </div>
  );
};

export default OrdersManagement;
