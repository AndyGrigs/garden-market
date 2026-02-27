// src/pages/AdminPanel/AdminNotifications/components/NotificationItem.tsx
import { Notification, NotificationType } from '@/types/INotification';
import { useTranslation } from 'react-i18next';
import {
  User,
  Package,
  ShoppingBag,
  AlertCircle,
  Trash2,
  CheckCheck,
} from 'lucide-react';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  isProcessing: boolean;
}

export const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
  isProcessing,
}: NotificationItemProps) => {
  const { t } = useTranslation();

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

  return (
    <li
      className={`border rounded-lg p-4 transition-all ${
        notification.isRead
          ? 'bg-white border-gray-200'
          : 'bg-blue-50 border-blue-200'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Icon & Content */}
        <div className="flex gap-3 flex-1">
          <div className="flex-shrink-0 mt-1">
            {getNotificationIcon(notification.type)}
          </div>

          <div className="flex-1 min-w-0">
            {/* Type Badge */}
            <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded mb-2">
              {getNotificationTypeName(notification.type)}
            </span>

            {/* Title */}
            <h3 className="font-semibold text-gray-900 mb-1">
              {getNotificationContent(notification).title}
            </h3>

            {/* Message */}
            <p className="text-sm text-gray-600 mb-2">{getNotificationContent(notification).message}</p>

            {/* Date */}
            <p className="text-xs text-gray-500">
              {formatDate(notification.createdAt)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
          {!notification.isRead && (
            <button
              onClick={() => onMarkAsRead(notification._id)}
              disabled={isProcessing}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
              title={t('notifications.markAsRead')}
            >
              <CheckCheck className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => onDelete(notification._id)}
            disabled={isProcessing}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
            title={t('common.delete')}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </li>
  );
};