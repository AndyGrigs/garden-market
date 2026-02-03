// src/pages/AdminPanel/AdminTrees/components/TreeGrid.tsx
import { Tree } from '@/types/ITree';
import { TreeCard } from './TreeCard';
import { useTranslation } from 'react-i18next';

interface TreeGridProps {
  trees: Tree[];
  onEdit: (tree: Tree) => void;
  onDelete: (id: string, imageUrl?: string) => void;
  isProcessing: boolean;
  selectedCategoryId: string;
}

export const TreeGrid = ({ 
  trees, 
  onEdit, 
  onDelete, 
  isProcessing,
  selectedCategoryId 
}: TreeGridProps) => {
  const { t } = useTranslation();

  if (trees.length === 0) {
    return (
      <div className="col-span-3 text-center text-gray-500 py-12">
        <p className="text-lg">
          {selectedCategoryId === 'all'
            ? t('categories.noCategories')
            : t('categories.noGoods')}
        </p>
        <p className="text-sm mt-2">
          {selectedCategoryId === 'all'
            ? t('common.addFirstProduct')
            : t('common.selectCategory')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {trees.map((tree) => (
        <TreeCard
          key={tree._id}
          tree={tree}
          onEdit={onEdit}
          onDelete={onDelete}
          isProcessing={isProcessing}
        />
      ))}
    </div>
  );
};
