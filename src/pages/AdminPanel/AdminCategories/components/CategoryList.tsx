// src/pages/AdminPanel/AdminCategories/components/CategoryList.tsx
import { Category } from '@/types/ICategories';
import { CategoryItem } from './CategoryItem';
import { useTranslation } from 'react-i18next';

interface CategoryListProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string, imageUrl?: string) => void;
  isProcessing: boolean;
}

export const CategoryList = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onEdit,
  onDelete,
  isProcessing,
}: CategoryListProps) => {
  const { t } = useTranslation();

  if (categories.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        <p className="text-lg">{t('categories.noCategories')}</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {categories.map((cat: Category) => (
        <CategoryItem
          key={cat._id}
          category={cat}
          isSelected={selectedCategoryId === cat._id}
          onSelect={onSelectCategory}
          onEdit={onEdit}
          onDelete={onDelete}
          isProcessing={isProcessing}
        />
      ))}
    </ul>
  );
};
