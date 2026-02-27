import { useGetSellerByIdQuery, useDeleteSellerMutation } from '@/store/api/adminApi';
import { useTranslation } from 'react-i18next';
import {
  X,
  User,
  Mail,
  Building2,
  Phone,
  MapPin,
  FileText,
  Calendar,
  Loader,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SellerDetailsModalProps {
  sellerId: string | null;
  onClose: () => void;
}

const SellerDetailsModal = ({ sellerId, onClose }: SellerDetailsModalProps) => {
  const { t } = useTranslation();
  const { data, isLoading } = useGetSellerByIdQuery(sellerId!, {
    skip: !sellerId,
  });
  const [deleteSeller, { isLoading: isDeleting }] = useDeleteSellerMutation();

  if (!sellerId) return null;

  const handleDelete = async () => {
    if (!window.confirm(t('admin.allSellers.confirmDelete'))) return;
    try {
      await deleteSeller(sellerId).unwrap();
      toast.success(t('admin.allSellers.deleted'));
      onClose();
    } catch {
      toast.error(t('admin.allSellers.deleteError'));
    }
  };

  const seller = data?.seller;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            {t('admin.allSellers.details')}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader className="w-8 h-8 animate-spin text-green-600" />
            </div>
          )}

          {!isLoading && seller && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">{t('admin.allSellers.name')}</p>
                  <p className="font-semibold text-gray-900">{seller.fullName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">{t('admin.allSellers.email')}</p>
                  <p className="text-gray-800">{seller.email}</p>
                </div>
              </div>

              {seller.sellerInfo?.nurseryName && (
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">{t('admin.sellers.nursery')}</p>
                    <p className="text-gray-800">{seller.sellerInfo.nurseryName}</p>
                  </div>
                </div>
              )}

              {seller.sellerInfo?.phoneNumber && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">{t('admin.sellers.phone')}</p>
                    <p className="text-gray-800">{seller.sellerInfo.phoneNumber}</p>
                  </div>
                </div>
              )}

              {seller.sellerInfo?.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">{t('admin.sellers.address')}</p>
                    <p className="text-gray-800">{seller.sellerInfo.address}</p>
                  </div>
                </div>
              )}

              {seller.sellerInfo?.businessLicense && (
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">{t('admin.sellers.license')}</p>
                    <p className="text-gray-800">{seller.sellerInfo.businessLicense}</p>
                  </div>
                </div>
              )}

              {seller.sellerInfo?.description && (
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">{t('admin.sellers.description')}</p>
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {seller.sellerInfo.description}
                    </p>
                  </div>
                </div>
              )}

              {seller.sellerInfo?.registrationDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">{t('admin.sellers.registered')}</p>
                    <p className="text-gray-800">
                      {new Date(seller.sellerInfo.registrationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">{t('admin.allSellers.status')}</p>
                {seller.sellerInfo?.isApproved === true && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                    {t('admin.allSellers.approved')}
                  </span>
                )}
                {seller.sellerInfo?.isApproved === false && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">
                    {t('admin.allSellers.rejected')}
                  </span>
                )}
                {seller.sellerInfo?.isApproved === undefined && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-orange-100 text-orange-800 rounded-full">
                    {t('admin.allSellers.pending')}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between p-6 border-t border-gray-200">
          <button
            onClick={handleDelete}
            disabled={isDeleting || isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? t('common.loading') : t('admin.allSellers.delete')}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerDetailsModal;
