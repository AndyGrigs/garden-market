import { useState } from 'react';
import { useGetPendingSellersQuery, useApproveSellerMutation, useRejectSellerMutation } from '@/store/api/adminApi';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle, Loader, User, Building2, Phone, MapPin, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSellers = () => {
  const { data, isLoading, error } = useGetPendingSellersQuery();
  // const [approveSeller] = useApproveSellerMutation();
  // const [rejectSeller] = useRejectSellerMutation();
  const { t } = useTranslation();
  const [expandedSeller, setExpandedSeller] = useState<string | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedSellerId, setSelectedSellerId] = useState<string>('');
  const [rejectReason, setRejectReason] = useState('');

  

  const openRejectModal = (userId: string) => {
    setSelectedSellerId(userId);
    setRejectReason('');
    setRejectModalOpen(true);
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
          {pendingSellers.map((seller) => {
            const sellerId = seller.id || seller._id || '';
            return (
          

                  {expandedSeller === sellerId && (
                    
                      )}

                     

                    

                    

                    
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row w-full gap-2 ml-4">
                  <button
                    onClick={() => handleApprove(sellerId)}
                    className="flex items-center gap-2 px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{t('admin.sellers.approve')}</span>
                  </button>

                  <button
                    onClick={() => openRejectModal(sellerId)}
                    className="flex items-center gap-2 px-4 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>{t('admin.sellers.reject')}</span>
                  </button>

                  <button
                    onClick={() => toggleExpand(sellerId)}
                    className="px-4 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    {expandedSeller === sellerId
                      ? t('admin.sellers.showLess')
                      : t('admin.sellers.showMore')}
                  </button>
                </div>
              </div>
            </div>
          );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && (
       
      )}
    </div>
  );
};

export default AdminSellers;
