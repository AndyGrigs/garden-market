// src/pages/AdminPanel/AdminCategories/components/AdminCategories.tsx
import { useState } from 'react';
import { Loader, XCircle, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAdminCategories, { CategoryFormData } from '../hooks/useAdminCategories';
import { CategoryList } from './CategoryList';
import { Category } from '@/types/ICategories';
import CategoryModal from './CategoryModal';

interface AdminCategoriesProps {
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

const AdminCategories = ({
  selectedCategoryId,
  onSelectCategory,
}: AdminCategoriesProps) => {
  const { t } = useTranslation();
  const {
    categories,
    isLoading,
    error,
    isProcessing,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useAdminCategories();

  // UI state for modal
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    editingCategory: Category | null;
  }>({ isOpen: false, editingCategory: null });

  // Modal handlers
  const openCreateModal = () => {
    setModalState({ isOpen: true, editingCategory: null });
  };

  const openEditModal = (category: Category) => {
    setModalState({ isOpen: true, editingCategory: category });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, editingCategory: null });
  };

  // Submit handler
  const handleSubmit = async (formData: CategoryFormData) => {
    if (modalState.editingCategory?._id) {
      await handleUpdate(modalState.editingCategory._id, formData);
    } else {
      await handleCreate(formData);
    }
    closeModal();
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
          <span>{t('dashboard.loadError')}</span>
        </div>
      </div>
    );
  }

  // Main Content
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('categories.categories')}
        </h2>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('categories.add')}
        </button>
      </div>

      {/* All Products button */}
      <div className="mb-4">
        <button
          onClick={() => onSelectCategory('all')}
          className={`w-full text-left p-3 rounded border transition-colors ${
            selectedCategoryId === 'all'
              ? 'bg-emerald-100 border-emerald-500'
              : 'border-gray-200 hover:bg-gray-100'
          }`}
        >
          {t('common.allProducts')}
        </button>
      </div>

      {/* Category List */}
      <CategoryList
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={onSelectCategory}
        onEdit={openEditModal}
        onDelete={handleDelete}
        isProcessing={isProcessing}
      />

      {/* Modal */}
      <CategoryModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        initialData={modalState.editingCategory?.name}
        initialImageUrl={modalState.editingCategory?.imageUrl}
      />
    </div>
  );
};

export default AdminCategories;
