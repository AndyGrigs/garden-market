// src/pages/AdminPanel/AdminOrders/hooks/useAdminOrders.ts
import { useState } from 'react';
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from '@/store/api/orderApi';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const useAdminOrders = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const { t } = useTranslation();

  // RTK Query
  const { data, isLoading, error, refetch } = useGetAllOrdersQuery({
    page,
    limit: 20,
    status: statusFilter || undefined,
    paymentStatus: paymentFilter || undefined,
  });

  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  // Handlers
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus({ id: orderId, status: newStatus }).unwrap();
      toast.success(t('admin.toast.statusUpdated'));
      refetch();
    } catch {
      toast.error(t('admin.toast.statusUpdateError'));
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
      toast.success(t('admin.toast.paymentStatusUpdated'));
      refetch();
    } catch {
      toast.error(t('admin.toast.paymentStatusUpdateError'));
    }
  };

  return {
    orders: data?.orders || [],
    totalPages: data?.totalPages || 1,
    currentPage: page,
    statusFilter,
    paymentFilter,
    isLoading,
    error,
    isProcessing: isUpdating,
    setPage,
    setStatusFilter,
    setPaymentFilter,
    handleStatusChange,
    handlePaymentStatusChange,
  };
};

export default useAdminOrders;