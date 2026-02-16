import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetTreeByIdQuery } from '@/store/api/treesApi';
import {
  useUpdateTreeTranslationsMutation,
  useApproveTreeMutation,
} from '@/store/api/adminApi';
import { Loader, Save, CheckCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminTreeTranslate = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: tree, isLoading, error } = useGetTreeByIdQuery(id!);
  const [updateTranslations, { isLoading: isSaving }] =
    useUpdateTreeTranslationsMutation();
  const [approveTree, { isLoading: isApproving }] = useApproveTreeMutation();

  const [titleRo, setTitleRo] = useState('');
  const [descriptionRo, setDescriptionRo] = useState('');

  useEffect(() => {
    if (tree) {
      setTitleRo(tree.title.ro || '');
      setDescriptionRo(tree.description.ro || '');
    }
  }, [tree]);

  const handleSave = async () => {
    if (!tree || !id) return;

    if (!titleRo.trim() || !descriptionRo.trim()) {
      toast.error(t('admin.translate.fillAllFields'));
      return;
    }

    try {
      await updateTranslations({
        id,
        body: {
          title: { ro: titleRo.trim() },
          description: { ro: descriptionRo.trim() },
        },
      }).unwrap();
      toast.success(t('admin.translate.saved'));
    } catch {
      toast.error(t('admin.translate.saveError'));
    }
  };

  const handleSaveAndApprove = async () => {
    if (!tree || !id) return;

    if (!titleRo.trim() || !descriptionRo.trim()) {
      toast.error(t('admin.translate.fillAllFields'));
      return;
    }

    try {
      await updateTranslations({
        id,
        body: {
          title: { ro: titleRo.trim() },
          description: { ro: descriptionRo.trim() },
        },
      }).unwrap();

      await approveTree(id).unwrap();
      toast.success(t('admin.translate.approvedSuccess'));
      navigate('/admin');
    } catch {
      toast.error(t('admin.translate.approveError'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error || !tree) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <span className="text-red-800">{t('admin.translate.loadError')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <button
        onClick={() => navigate('/admin')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('admin.translate.backToAdmin')}
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {t('admin.translate.title')}
      </h1>

      {tree.imageUrl && (
        <img
          src={tree.imageUrl}
          alt={tree.title.ru}
          className="w-32 h-32 object-cover rounded-lg mb-6"
        />
      )}

      {/* Russian texts (read-only) */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          {t('admin.translate.originalRu')}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            {t('admin.translate.titleLabel')}
          </label>
          <div className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-700">
            {tree.title.ru}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            {t('admin.translate.descriptionLabel')}
          </label>
          <div className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-700 whitespace-pre-wrap">
            {tree.description.ru}
          </div>
        </div>
      </div>

      {/* Romanian translation inputs */}
      <div className="bg-white rounded-lg p-6 mb-6 border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-700 mb-4">
          {t('admin.translate.translationRo')}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('admin.translate.titleLabel')}
          </label>
          <input
            type="text"
            value={titleRo}
            onChange={(e) => setTitleRo(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder={t('admin.translate.titlePlaceholder')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('admin.translate.descriptionLabel')}
          </label>
          <textarea
            value={descriptionRo}
            onChange={(e) => setDescriptionRo(e.target.value)}
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-vertical"
            placeholder={t('admin.translate.descriptionPlaceholder')}
          />
        </div>
      </div>

      {/* Product info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200 text-sm text-gray-600">
        <p>
          <strong>{t('common.price')}:</strong> {tree.price} MDL
        </p>
        <p>
          <strong>{t('product.stock')}:</strong> {tree.stock}
        </p>
        {tree.seller && (
          <p>
            <strong>{t('product.seller')}:</strong> {tree.seller.fullName}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={isSaving || isApproving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {isSaving ? t('common.loading') : t('admin.translate.save')}
        </button>

        <button
          onClick={handleSaveAndApprove}
          disabled={isSaving || isApproving}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle className="w-4 h-4" />
          {isApproving
            ? t('common.loading')
            : t('admin.translate.saveAndApprove')}
        </button>
      </div>
    </div>
  );
};

export default AdminTreeTranslate;
