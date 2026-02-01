import { useState } from 'react';
import { Loader, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAdminSellers from '../hooks/useAdminSellers';
import SellerCard from './SellerCard';
import { RejectSellerModal } from './RejectSellerModal';

const AdminSellers = () => {
  const { t } = useTranslation();
  const {
    pendingSellers,
    isLoading,
    error,
    isApproving,
    isRejecting,
    handleApprove,
    handleReject,
  } = useAdminSellers();

  // ✅ Тільки UI стан для модалки
  const [rejectModal, setRejectModal] = useState<{
    isOpen: boolean;
    sellerId: string;
  }>({ isOpen: false, sellerId: '' });

  // ✅ Handlers для UI
  const openRejectModal = (sellerId: string) => {
    setRejectModal({ isOpen: true, sellerId });
  };

  const closeRejectModal = () => {
    setRejectModal({ isOpen: false, sellerId: '' });
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-800">
          <XCircle className="w-5 h-5" />
          <span>{t('admin.sellers.error')}</span>
        </div>
      </div>
    );
  }

  // Empty State
  if (pendingSellers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">{t('admin.sellers.noPending')}</p>
      </div>
    );
  }

  // Main Content
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t('admin.sellers.title')}
      </h2>

      <div className="space-y-4">
        {pendingSellers.map((seller) => (
          <SellerCard
            key={seller._id}
            seller={seller}
            onApprove={handleApprove}
            onReject={openRejectModal}
            isProcessing={isApproving || isRejecting}
          />
        ))}
      </div>

      {/* Reject Modal */}
      <RejectSellerModal
        isOpen={rejectModal.isOpen}
        sellerId={rejectModal.sellerId}
        onClose={closeRejectModal}
        onConfirm={handleReject}
      />
    </div>
  );
};

export default AdminSellers;
