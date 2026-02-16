import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetPendingTreesQuery,
  useApproveTreeMutation,
} from '@/store/api/adminApi';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle,
  Loader,
  Package,
  User,
  DollarSign,
  Languages,
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPendingTrees = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetPendingTreesQuery();
  const [approveTree] = useApproveTreeMutation();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'ru' | 'ro';
  const [expandedTree, setExpandedTree] = useState<string | null>(null);

  const handleApprove = async (treeId: string) => {
    if (window.confirm(t('admin.trees.confirmApprove'))) {
      try {
        await approveTree(treeId).unwrap();
        toast.success(t('admin.trees.approved'));
      } catch (err) {
        console.error(err);
        toast.error(t('admin.trees.approvalError'));
      }
    }
  };

  const toggleExpand = (treeId: string) => {
    setExpandedTree(expandedTree === treeId ? null : treeId);
  };

  const getTreeTitle = (title: { ru: string; ro?: string }) => {
    return title[lang] || title.ru;
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
        <span className="text-red-800">{t('admin.trees.error')}</span>
      </div>
    );
  }

  const pendingTrees = data?.trees || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t('admin.trees.pendingTitle')}
        {pendingTrees.length > 0 && (
          <span className="ml-2 px-2 py-1 text-sm bg-orange-500 text-white rounded-full">
            {pendingTrees.length}
          </span>
        )}
      </h2>

      {pendingTrees.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {t('admin.trees.noPending')}
        </div>
      ) : (
        <div className="space-y-4">
          {pendingTrees.map((tree) => (
            <div
              key={tree._id}
              className="border border-orange-200 rounded-lg p-4 bg-orange-50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {tree.imageUrl && (
                      <img
                        src={tree.imageUrl}
                        alt={getTreeTitle(tree.title)}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {getTreeTitle(tree.title)}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <User className="w-4 h-4" />
                        <span>{tree.seller.fullName}</span>
                        {tree.seller.sellerInfo?.nurseryName && (
                          <span className="text-gray-400">
                            ({tree.seller.sellerInfo.nurseryName})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedTree === tree._id && (
                    <div className="space-y-2 mt-3 pt-3 border-t border-orange-200">
                      <p className="text-sm text-gray-700">
                        <strong>{t('common.describing')}:</strong>{' '}
                        {tree.description[lang] || tree.description.ru}
                      </p>

                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{tree.price} MDL</span>
                        <span className="text-gray-400">|</span>
                        <Package className="w-4 h-4 text-gray-500" />
                        <span>
                          {t('common.quantity')}: {tree.stock}
                        </span>
                      </div>

                      {tree.category && (
                        <p className="text-sm text-gray-600">
                          <strong>{t('categories.category')}:</strong>{' '}
                          {getTreeTitle(tree.category.title)}
                        </p>
                      )}

                      <p className="text-xs text-gray-400">
                        {t('admin.trees.created')}:{' '}
                        {new Date(tree.createdAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/trees/${tree._id}/translate`)
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    <Languages className="w-4 h-4" />
                    <span>{t('admin.translate.title')}</span>
                  </button>

                  <button
                    onClick={() => handleApprove(tree._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{t('admin.trees.approve')}</span>
                  </button>

                  <button
                    onClick={() => toggleExpand(tree._id)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    {expandedTree === tree._id
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

export default AdminPendingTrees;
