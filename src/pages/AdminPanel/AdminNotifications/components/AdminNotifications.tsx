// src/pages/AdminPanel/AdminNotifications/components/AdminNotifications.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader, XCircle, Plus, CheckCheck } from 'lucide-react';
import useAdminNotifications, { NotificationFormData } from '../hooks/useAdminNotifications';
import { NotificationList } from './NotificationList';
import { NotificationModal } from './NotificationModal';

const AdminNotifications = () => {
  const { t } = useTranslation();
  const {
    notifications,
    totalPages,
    currentPage,
    isLoading,
    error,
    isProcessing,
    setPage,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDelete,
    handleCreate,
  } = useAdminNotifications();

  // UI state for modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (formData: NotificationFormData) => {
    const success = await handleCreate(formData);
    if (success) {
      closeModal();
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-800">
          <XCircle className="w-5 h-5" />
          <span>{t('notifications.loadError')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h2 className="text-2xl font-bold mb-3 text-gray-900">
          {t('notifications.title')}
        </h2>

        <div className="flex gap-3">
          {/* Mark All as Read Button */}
          <button
            onClick={handleMarkAllAsRead}
            disabled={isProcessing || notifications.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCheck className="w-5 h-5" />
            {t('notifications.markAllRead')}
          </button>

          {/* Create Notification Button */}
          <button
            onClick={openModal}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            {t('notifications.create')}
          </button>
        </div>
      </div>

      {/* Notification List */}
      <NotificationList
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDelete}
        isProcessing={isProcessing}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('common.previous')}
          </button>

          <span className="px-4 py-2 text-gray-700">
            {t('common.page')} {currentPage} {t('common.of')} {totalPages}
          </span>

          <button
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('common.next')}
          </button>
        </div>
      )}

      {/* Modal */}
      <NotificationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AdminNotifications;