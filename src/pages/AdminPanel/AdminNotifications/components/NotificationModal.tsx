// src/pages/AdminPanel/AdminNotifications/components/NotificationModal.tsx
import { useState, useEffect, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { NotificationType } from '@/types/INotification';
import { NotificationFormData } from '../hooks/useAdminNotifications';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NotificationFormData) => void;
}

export const NotificationModal = ({
  isOpen,
  onClose,
  onSubmit,
}: NotificationModalProps) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<NotificationFormData>({
    type: 'other',
    title: '',
    message: '',
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({ type: 'other', title: '', message: '' });
    }
  }, [isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {t('notifications.create')}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('notifications.typeLabel')}
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as NotificationType })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
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
              <option value="other">
                {t('notifications.types.other')}
              </option>
            </select>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('notifications.titleLabel')}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('notifications.titlePlaceholder')}
              required
            />
          </div>

          {/* Message Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('notifications.messageLabel')}
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('notifications.messagePlaceholder')}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
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
  );
};