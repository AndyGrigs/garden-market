import { useTranslation } from 'react-i18next';
import {
  useApproveSellerMutation,
  useGetPendingSellersQuery,
  useRejectSellerMutation,
} from '@/store/api/adminApi';
import toast from 'react-hot-toast';

const useAdminSellers = () => {
  const { t } = useTranslation();
  const { data,  isLoading, error } = useGetPendingSellersQuery();
  const [approveSeller, { isLoading: isApproving }] =
    useApproveSellerMutation();
  const [rejectSeller, { isLoading: isRejecting }] = useRejectSellerMutation();

  const handleApprove = async (userId: string) => {
    if (window.confirm(t('admin.sellers.confirmApprove'))) {
      try {
        await approveSeller(userId).unwrap();
        toast.success(t('admin.sellers.approved'));
      } catch (err) {
        toast.error(t('admin.sellers.approvalError'));
        console.log(err)
      }
    }
  };

  const handleReject = async (userId: string, reason?: string) => {
      try {
       await rejectSeller({
        userId,
        reason: reason?.trim() || undefined
       })
       toast.success(t('admin.sellers.rejected'))
      } catch (err) {
        toast.error(t('admin.sellers.rejectionError'));
        console.log(err)
      }
    };

  return {
    pendingSellers: data?.sellers || [],
    isLoading,
    error,
    isApproving,
    isRejecting,
    handleApprove,
    handleReject
  };
};

export default useAdminSellers;
