// src/pages/AdminPanel/AdminTrees/components/AdminTrees.tsx
import { useState } from 'react';
import { Loader, XCircle, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAdminTrees from '../hooks/useAdminTrees';
import { TreeGrid } from './TreeGrid';
import { Tree, TreeFormData } from '@/types/ITree';
import TreeModal from './TreeModal';

interface AdminTreesProps {
  selectedCategoryId?: string;
}

const AdminTrees = ({ selectedCategoryId = 'all' }: AdminTreesProps) => {
  const { t } = useTranslation();
  const {
    trees,
    isLoading,
    error,
    isProcessing,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useAdminTrees(selectedCategoryId);

  // UI state for modal
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    editingTree: Tree | null;
  }>({ isOpen: false, editingTree: null });

  // Modal handlers
  const openCreateModal = () => {
    setModalState({ isOpen: true, editingTree: null });
  };

  const openEditModal = (tree: Tree) => {
    setModalState({ isOpen: true, editingTree: tree });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, editingTree: null });
  };

  // Submit handler
  const handleSubmit = async (formData: TreeFormData) => {
    if (modalState.editingTree?._id) {
      await handleUpdate(modalState.editingTree._id, formData);
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

  // Get display title
  const getDisplayTitle = () => {
    if (selectedCategoryId === 'all') {
      return t('common.allGoods');
    }
    return t('common.goodsInCategory');
  };

  // Main Content
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {getDisplayTitle()}
        </h2>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('dashboard.addProduct')}
        </button>
      </div>

      {/* Tree Grid */}
      <TreeGrid
        trees={trees}
        onEdit={openEditModal}
        onDelete={handleDelete}
        isProcessing={isProcessing}
        selectedCategoryId={selectedCategoryId}
      />

      {/* Modal */}
      <TreeModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        initialData={modalState.editingTree ? {
          _id: modalState.editingTree._id,
          title: modalState.editingTree.title,
          description: modalState.editingTree.description,
          price: modalState.editingTree.price,
          stock: modalState.editingTree.stock,
          imageUrl: modalState.editingTree.imageUrl,
          category: typeof modalState.editingTree.category === 'string'
            ? modalState.editingTree.category
            : modalState.editingTree.category?._id || '',
        } : undefined}
      />
    </div>
  );
};

export default AdminTrees;
