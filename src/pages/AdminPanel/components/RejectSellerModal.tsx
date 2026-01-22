import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface RejectSellerModalProps {
  isOpen: boolean;
  sellerId: string;
  onClose: () => void;
  onConfirm: (userId: string, reason: string) => Promise<void>;
}

const RejectSellerModal = ({
  isOpen,
  sellerId,
  onClose,
  onConfirm,
}: RejectSellerModalProps) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  if(!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setReason('');
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            {t('admin.sellers.rejectTitle')}
          </h3>
          <button
            onClick={() => setRejectModalOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            {t('admin.sellers.rejectDescription')}
          </p>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('admin.sellers.rejectReason')}
          </label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder={t('admin.sellers.rejectReasonPlaceholder')}
          />
          <p className="text-xs text-gray-500 mt-1">
            {t('admin.sellers.rejectOptional')}
          </p>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={() => setRejectModalOpen(false)}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleReject}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {t('admin.sellers.confirmReject')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectSellerModal;
