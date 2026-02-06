// src/pages/AdminPanel/AdminNotifications/components/NotificationList.tsx
import { Notification } from '@/types/INotification';
import { NotificationItem } from './NotificationItem';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  isProcessing: boolean;
}

export const NotificationList = ({
  notifications,
  onMarkAsRead,
  onDelete,
  isProcessing,
}: NotificationListProps) => {
  const { t } = useTranslation();

  // Empty state
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">{t('notifications.empty')}</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification._id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
          isProcessing={isProcessing}
        />
      ))}
    </ul>
  );
};