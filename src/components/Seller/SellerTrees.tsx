import { useState } from "react";
import { Plus, Edit2, Trash2, Package} from "lucide-react";
import { useTranslation } from "react-i18next";

import toast from "react-hot-toast";
import SellerTreeModal from "./SellerTreeModal";
import { Tree } from '../../types/ITree';
import { useLanguage } from '../../hooks/useLanguage';
import { useDeleteSellerTreeMutation } from '../../store/api/sellerApi';

interface SellerTreesProps {
  trees: Tree[];
  isLoading: boolean;
}

const SellerTrees = ({ trees, isLoading }: SellerTreesProps) => {
  const { t } = useTranslation();
  const lang = useLanguage();
  const [deleteTree] = useDeleteSellerTreeMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTree, setEditingTree] = useState<Tree | null>(null);

  const getTreeTitle = (title: { [key: string]: string }) => {
    return title?.[lang] || title?.en || title?.ru || "Unknown";
  };

  const getTreeDescription = (description: { [key: string]: string }) => {
    return description?.[lang] || description?.en || description?.ru || "";
  };

  const handleDeleteTree = async (treeId: string, treeName: string) => {
    if (!window.confirm(t('seller.confirmDelete', { 
      name: treeName,
      defaultValue: `Ви впевнені, що хочете видалити "${treeName}"?` 
    }))) {
      return;
    }

    try {
      await deleteTree(treeId).unwrap();
      toast.success(t('seller.deleteSuccess', { 
        defaultValue: 'Товар успішно видалено' 
      }));
    } catch (error) {
      toast.error(t('seller.deleteError', { 
        defaultValue: 'Помилка видалення товару' 
      }));
      console.error('Delete error:', error);
    }
  };

  const handleEditTree = (tree: Tree) => {
    setEditingTree(tree);
    setIsModalOpen(true);
  };

  const handleAddTree = () => {
    setEditingTree(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTree(null);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">
          {t('common.loading', { defaultValue: 'Завантаження...' })}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {t('seller.myProducts', { defaultValue: 'Мої товари' })}
        </h2>
        <button
          onClick={handleAddTree}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>{t('seller.addProduct', { defaultValue: 'Додати товар' })}</span>
        </button>
      </div>

      {trees.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('seller.noProducts', { defaultValue: 'У вас поки немає товарів' })}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('seller.addFirstProduct', { 
              defaultValue: 'Додайте свій перший товар, щоб почати продажі' 
            })}
          </p>
          <button
            onClick={handleAddTree}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            {t('seller.addProduct', { defaultValue: 'Додати товар' })}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trees.map((tree) => (
            <div
              key={tree._id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img
                  src={tree.imageUrl ? `${import.meta.env.VITE_API_URL}${tree.imageUrl}` : "/placeholder.jpg"}
                  alt={getTreeTitle(tree.title)}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    tree.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {tree.isActive 
                      ? t('common.active', { defaultValue: 'Активний' })
                      : t('common.inactive', { defaultValue: 'Неактивний' })
                    }
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {getTreeTitle(tree.title)}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {getTreeDescription(tree.description)}
                </p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-emerald-600">
                    {tree.price} грн
                  </span>
                  <span className="text-sm text-gray-500">
                    {t('seller.stock', { defaultValue: 'Залишок' })}: {tree.stock}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditTree(tree)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>{t('common.edit', { defaultValue: 'Редагувати' })}</span>
                  </button>
                  <button
                    onClick={() => handleDeleteTree(tree._id, getTreeTitle(tree.title))}
                    className="flex-1 flex items-center justify-center space-x-2 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>{t('common.delete', { defaultValue: 'Видалити' })}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <SellerTreeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingTree={editingTree}
      />
    </div>
  );
};

export default SellerTrees;