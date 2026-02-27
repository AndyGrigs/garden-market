import { useState } from 'react';
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
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
} from 'lucide-react';
import { Notification, NotificationType } from '@/types/INotification';
import toast from 'react-hot-toast';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown = ({ onClose }: NotificationDropdownProps) => {
  const { t } = useTranslation();
  const [page] = useState(1);
  const { data, isLoading } = useGetNotificationsQuery({ page, limit: 10 });
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const getNotificationContent = (notification: Notification) => {
    if (notification.type === 'tree_approved') {
      return {
        title: t('notifications.treeApprovedTitle'),
        message: t('notifications.treeApprovedMessage', {
          treeName: notification.data?.treeName ?? notification.title,
          sellerName: notification.data?.sellerName ?? '',
        }),
      };
    }
    return { title: notification.title, message: notification.message };
  };

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

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
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
    try {
      await deleteNotification(id).unwrap();
      toast.success(t('notifications.deleted'));
    } catch {
      toast.error(t('notifications.deleteError'));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t('notifications.justNow');
    if (minutes < 60) return t('notifications.minutesAgo', { count: minutes });
    if (hours < 24) return t('notifications.hoursAgo', { count: hours });
    if (days < 7) return t('notifications.daysAgo', { count: days });
    return date.toLocaleDateString();
  };

  const notifications = data?.notifications || [];
  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-1rem)] bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('notifications.title')}
          </h3>
          {hasUnread && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <CheckCheck className="w-4 h-4" />
              {t('notifications.markAllRead')}
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto flex-1">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader className="w-6 h-6 animate-spin text-gray-600" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {t('notifications.empty')}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification: Notification) => (
              <div
                key={notification._id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {getNotificationContent(notification).title}
                      </p>
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full"
                          title={t('notifications.markAsRead')}
                        />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {getNotificationContent(notification).message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {formatDate(notification.createdAt)}
                      </span>
                      <button
                        onClick={() => handleDelete(notification._id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {t('notifications.viewAll')}
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
