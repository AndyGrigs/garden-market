import { useState } from 'react';
import { useGetPendingSellersQuery, useApproveSellerMutation } from '@/store/api/adminApi';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle, Loader, User, Building2, Phone, MapPin, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSellers = () => {
  const { data, isLoading, error } = useGetPendingSellersQuery();
  const [approveSeller] = useApproveSellerMutation();
  const { t } = useTranslation();
  const [expandedSeller, setExpandedSeller] = useState<string | null>(null);

  const handleApprove = async (userId: string) => {
    if (window.confirm(t('admin.sellers.confirmApprove'))) {
      try {
        await approveSeller(userId).unwrap();
        toast.success(t('admin.sellers.approved'));
      } catch (err) {
        toast.error(t('admin.sellers.approvalError'));
      }
    }
  };

  const toggleExpand = (userId: string) => {
    setExpandedSeller(expandedSeller === userId ? null : userId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

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

  const pendingSellers = data?.sellers || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t('admin.sellers.title')}
      </h2>

      {pendingSellers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {t('admin.sellers.noPending')}
        </div>
      ) : (
        <div className="space-y-4">
          {pendingSellers.map((seller) => (
            <div
              key={seller.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {seller.fullName}
                    </h3>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1 mb-3">
                    <p>{seller.email}</p>
                    {seller.sellerInfo?.nurseryName && (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>{seller.sellerInfo.nurseryName}</span>
                      </div>
                    )}
                  </div>

                  {expandedSeller === seller.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                      {seller.sellerInfo?.phoneNumber && (
                        <div className="flex items-start gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
                          <div>
                            <span className="font-medium text-gray-700">
                              {t('admin.sellers.phone')}:
                            </span>
                            <span className="ml-2 text-gray-600">
                              {seller.sellerInfo.phoneNumber}
                            </span>
                          </div>
                        </div>
                      )}

                      {seller.sellerInfo?.address && (
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                          <div>
                            <span className="font-medium text-gray-700">
                              {t('admin.sellers.address')}:
                            </span>
                            <span className="ml-2 text-gray-600">
                              {seller.sellerInfo.address}
                            </span>
                          </div>
                        </div>
                      )}

                      {seller.sellerInfo?.businessLicense && (
                        <div className="flex items-start gap-2 text-sm">
                          <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                          <div>
                            <span className="font-medium text-gray-700">
                              {t('admin.sellers.license')}:
                            </span>
                            <span className="ml-2 text-gray-600">
                              {seller.sellerInfo.businessLicense}
                            </span>
                          </div>
                        </div>
                      )}

                      {seller.sellerInfo?.description && (
                        <div className="flex items-start gap-2 text-sm">
                          <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                          <div>
                            <span className="font-medium text-gray-700">
                              {t('admin.sellers.description')}:
                            </span>
                            <p className="mt-1 text-gray-600">
                              {seller.sellerInfo.description}
                            </p>
                          </div>
                        </div>
                      )}

                      {seller.sellerInfo?.registrationDate && (
                        <div className="text-sm text-gray-500">
                          {t('admin.sellers.registered')}:{' '}
                          {new Date(seller.sellerInfo.registrationDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleApprove(seller.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{t('admin.sellers.approve')}</span>
                  </button>

                  <button
                    onClick={() => toggleExpand(seller.id)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    {expandedSeller === seller.id
                      ? t('admin.sellers.showLess')
                      : t('admin.sellers.showMore')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSellers;
