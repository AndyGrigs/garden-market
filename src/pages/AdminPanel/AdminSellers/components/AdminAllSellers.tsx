import { useState } from 'react';
import { useGetAllSellersQuery } from '@/store/api/adminApi';
import { useTranslation } from 'react-i18next';
import { Loader, Building2, User, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';
import SellerDetailsModal from './SellerDetailsModal';

const StatusBadge = ({ isApproved }: { isApproved?: boolean }) => {
  const { t } = useTranslation();

  if (isApproved === true) {
    return (
      <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
        <CheckCircle className="w-3 h-3" />
        {t('admin.allSellers.approved')}
      </span>
    );
  }
  if (isApproved === false) {
    return (
      <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
        <XCircle className="w-3 h-3" />
        {t('admin.allSellers.rejected')}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
      <Clock className="w-3 h-3" />
      {t('admin.allSellers.pending')}
    </span>
  );
};

const AdminAllSellers = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useGetAllSellersQuery();
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);

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
        <span className="text-red-800">{t('admin.sellers.error')}</span>
      </div>
    );
  }

  const sellers = data?.sellers || [];
  const approved = sellers.filter((s) => s.sellerInfo?.isApproved === true).length;
  const pending = sellers.filter((s) => s.sellerInfo?.isApproved === undefined).length;
  const rejected = sellers.filter((s) => s.sellerInfo?.isApproved === false).length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {t('admin.allSellers.title')}
      </h2>

      {/* Summary */}
      <div className="flex gap-4 mb-6">
        <span className="text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full">
          {t('admin.allSellers.approved')}: {approved}
        </span>
        <span className="text-sm text-orange-700 bg-orange-50 px-3 py-1 rounded-full">
          {t('admin.allSellers.pending')}: {pending}
        </span>
        <span className="text-sm text-red-700 bg-red-50 px-3 py-1 rounded-full">
          {t('admin.allSellers.rejected')}: {rejected}
        </span>
      </div>

      {sellers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {t('admin.allSellers.noSellers')}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-3 pr-4 font-medium">{t('admin.allSellers.name')}</th>
                <th className="pb-3 pr-4 font-medium">{t('admin.allSellers.email')}</th>
                <th className="pb-3 pr-4 font-medium">{t('admin.sellers.nursery')}</th>
                <th className="pb-3 pr-4 font-medium">{t('admin.allSellers.status')}</th>
                <th className="pb-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sellers.map((seller) => (
                <tr key={seller._id ?? seller.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="font-medium text-gray-900">{seller.fullName}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-gray-600">{seller.email}</td>
                  <td className="py-3 pr-4">
                    {seller.sellerInfo?.nurseryName ? (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>{seller.sellerInfo.nurseryName}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge isApproved={seller.sellerInfo?.isApproved} />
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => setSelectedSellerId(seller._id ?? seller.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {t('admin.allSellers.viewDetails')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <SellerDetailsModal
        sellerId={selectedSellerId}
        onClose={() => setSelectedSellerId(null)}
      />
    </div>
  );
};

export default AdminAllSellers;
