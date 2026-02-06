// src/pages/AdminPanel/AdminNotifications/hooks/useAdminNotifications.ts
import { useState } from 'react';
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useCreateNotificationMutation,
} from '@/store/api/adminApi';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { NotificationType } from '@/types/INotification';

export interface NotificationFormData {
  type: NotificationType;
  title: string;
  message: string;
}

const useAdminNotifications = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  // RTK Query hooks
  const { data, isLoading, error } = useGetNotificationsQuery({ page, limit: 20 });
  const [markAsRead, { isLoading: isMarkingAsRead }] = useMarkAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAllAsRead }] = useMarkAllAsReadMutation();
  const [deleteNotification, { isLoading: isDeleting }] = useDeleteNotificationMutation();
  const [createNotification, { isLoading: isCreating }] = useCreateNotificationMutation();

  // Handlers
  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
      toast.success(t('notifications.markedRead'));
    } catch {
      toast.error(t('notifications.markReadError'));
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      toast.success(t('notifications.allMarkedRead'));
    } catch {
      toast.error(t('notifications.markAllReadError'));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('notifications.confirmDelete'))) {
      try {
        await deleteNotification(id).unwrap();
        toast.success(t('notifications.deleted'));
      } catch {
        toast.error(t('notifications.deleteError'));
      }
    }
  };

  const handleCreate = async (formData: NotificationFormData) => {
    if (!formData.title || !formData.message) {
      toast.error(t('notifications.fillAllFields'));
      return false;
    }

    try {
      await createNotification(formData).unwrap();
      toast.success(t('notifications.created'));
      return true;
    } catch {
      toast.error(t('notifications.createError'));
      return false;
    }
  };

  const isProcessing = isMarkingAsRead || isMarkingAllAsRead || isDeleting || isCreating;

  return {
    notifications: data?.notifications || [],
    totalPages: data ? Math.ceil(data.total / data.limit) : 1,
    currentPage: page,
    isLoading,
    error,
    isProcessing,
    setPage,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDelete,
    handleCreate,
  };
};

export default useAdminNotifications;