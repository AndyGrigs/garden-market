import { useState } from 'react';
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useCreateNotificationMutation,
} from '@/store/api/adminApi';
import { useTranslation } from 'react-i18next';
import {
  CheckCheck,
  Loader,
  Trash2,
  User,
  ShoppingBag,
  AlertCircle,
  Package,
  Plus,
  X,
} from 'lucide-react';
import { Notification, NotificationType } from '@/types/INotification';
import toast from 'react-hot-toast';

const AdminNotifications = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data, isLoading } = useGetNotificationsQuery({ page, limit: 20 });
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [createNotification] = useCreateNotificationMutation();

  const [newNotification, setNewNotification] = useState({
    type: 'other' as NotificationType,
    title: '',
    message: '',
  });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'new_seller_registration':
        return <User className="w-5 h-5 text-blue-600" />;
      case 'new_product_created':
        return <Package className="w-5 h-5 text-green-600" />;
      case 'order_placed':
        return <ShoppingBag className="w-5 h-5 text-purple-600" />;
      case 'order_cancelled':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationTypeName = (type: NotificationType) => {
    return t(`notifications.types.${type}`);
  };

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

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotification.title || !newNotification.message) {
      toast.error(t('notifications.fillAllFields'));
      return;
    }

    try {
      await createNotification(newNotification).unwrap();
      toast.success(t('notifications.created'));
      setIsCreateModalOpen(false);
      setNewNotification({ type: 'other', title: '', message: '' });
    } catch {
      toast.error(t('notifications.createError'));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(t('common.locale'), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const notifications = data?.notifications || [];
  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t('notifications.management')}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {t('notifications.total')}: {data?.total || 0} | {t('notifications.unread')}:{' '}
              {data?.unreadCount || 0}
            </p>
          </div>
          <div className="flex gap-2">
            {hasUnread && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                {t('notifications.markAllRead')}
              </button>
            )}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t('notifications.create')}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader className="w-8 h-8 animate-spin text-gray-600" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {t('notifications.empty')}
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification: Notification) => (
              <div
                key={notification._id}
                className={`border rounded-lg p-4 transition-all ${
                  !notification.isRead
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-base font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded whitespace-nowrap">
                            {getNotificationTypeName(notification.type)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 break-words">
                          {notification.message}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatDate(notification.createdAt)}
                        </span>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors whitespace-nowrap"
                          >
                            {t('notifications.markAsRead')}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {data && data.total > 20 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
            >
              {t('common.previous')}
            </button>
            <span className="px-4 py-2 text-gray-700">
              {page} / {Math.ceil(data.total / 20)}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(data.total / 20)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
            >
              {t('common.next')}
            </button>
          </div>
        )}
      </div>

      {/* Create Notification Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {t('notifications.createNew')}
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateNotification} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('notifications.type')}
                </label>
                <select
                  value={newNotification.type}
                  onChange={(e) =>
                    setNewNotification({
                      ...newNotification,
                      type: e.target.value as NotificationType,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="other">{t('notifications.types.other')}</option>
                  <option value="new_seller_registration">
                    {t('notifications.types.new_seller_registration')}
                  </option>
                  <option value="new_product_created">
                    {t('notifications.types.new_product_created')}
                  </option>
                  <option value="order_placed">
                    {t('notifications.types.order_placed')}
                  </option>
                  <option value="order_cancelled">
                    {t('notifications.types.order_cancelled')}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('notifications.titleLabel')}
                </label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) =>
                    setNewNotification({ ...newNotification, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('notifications.titlePlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('notifications.messageLabel')}
                </label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) =>
                    setNewNotification({ ...newNotification, message: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('notifications.messagePlaceholder')}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {t('notifications.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
