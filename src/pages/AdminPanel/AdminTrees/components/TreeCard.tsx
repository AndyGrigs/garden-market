
// src/pages/AdminPanel/AdminTrees/components/TreeCard.tsx
import { Tree } from '@/types/ITree';
import { Edit, Trash2, Package, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { BASE_URL } from '@/config';
import { ActionButton } from '@/shared/ui/ActionButton';

interface TreeCardProps {
  tree: Tree;
  onEdit: (tree: Tree) => void;
  onDelete: (id: string, imageUrl?: string) => void;
  isProcessing: boolean;
}

export const TreeCard = ({ tree, onEdit, onDelete, isProcessing }: TreeCardProps) => {
  const { t } = useTranslation();
  const lang = useLanguage();

  const getTitle = (title: { [key: string]: string }) => {
    return title?.[lang] || title?.ru || title?.ro || '';
  };

  const getCategoryName = () => {
    if (!tree.category) return t('categories.noCategory');
    if (typeof tree.category === 'string') return tree.category;
    return tree.category.name?.[lang] || tree.category.name?.ru || '';
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white">
      {/* Image */}
      <div className="relative h-40 bg-gray-100">
        <img
          src={tree.imageUrl ? `${BASE_URL}${tree.imageUrl}` : '/placeholder.jpg'}
          alt={getTitle(tree.title)}
          className="w-full h-full object-cover"
        />
        {!tree.isActive && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            {t('dashboard.inactive')}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 truncate">
          {getTitle(tree.title)}
        </h3>

        <div className="space-y-2 mb-4">
          {/* Price */}
          <div className="flex items-center gap-2 text-sm">
            <Tag className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-600">
              {tree.price} MDL
            </span>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="w-4 h-4" />
            <span>{t('dashboard.stock')}: {tree.stock}</span>
          </div>

          {/* Category */}
          <div className="text-sm text-gray-500">
            {t('categories.category')}: {getCategoryName()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <ActionButton
            onClick={() => onEdit(tree)}
            disabled={isProcessing}
            className="flex-1 bg-yellow-500 text-white hover:bg-yellow-600"
          >
            <Edit className="w-4 h-4" />
            <span>{t('dashboard.edit')}</span>
          </ActionButton>

          <ActionButton
            onClick={() => onDelete(tree._id, tree.imageUrl)}
            disabled={isProcessing}
            className="flex-1 bg-red-500 text-white hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('dashboard.delete')}</span>
          </ActionButton>
        </div>
      </div>
    </div>
  );
};
