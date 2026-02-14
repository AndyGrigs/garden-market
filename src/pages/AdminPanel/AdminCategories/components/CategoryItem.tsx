// src/pages/AdminPanel/AdminCategories/components/CategoryItem.tsx
import { Category } from '@/types/ICategories';
import { Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { BASE_URL } from '@/config';
import { getCategoryName } from '@/shared/helpers/getCategoryName';

interface CategoryItemProps {
  category: Category;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string, imageUrl?: string) => void;
  isProcessing: boolean;
}

export const CategoryItem = ({
  category,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  isProcessing,
}: CategoryItemProps) => {
  const { t } = useTranslation();
  const lang = useLanguage();

  return (
    <li className="flex justify-between items-center border-b pb-2">
      <div className="flex items-center gap-3">
        {category.imageUrl && (
          <img
            src={category.imageUrl.startsWith('http') ? category.imageUrl : `${BASE_URL}${category.imageUrl}`}
            alt={getCategoryName(category, lang)}
            className="w-12 h-12 object-cover rounded-md"
          />
        )}
        <span
          onClick={() => onSelect(category._id)}
          className={`cursor-pointer ${
            isSelected
              ? 'text-emerald-600 font-bold'
              : 'text-gray-800'
          }`}
        >
          {getCategoryName(category, lang)}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(category)}
          disabled={isProcessing}
          className="text-blue-500 text-sm hover:underline disabled:opacity-50"
        >
          <Edit className="w-4 h-4 inline mr-1" />
          {t('categories.edit')}
        </button>
        <button
          onClick={() => onDelete(category._id, category.imageUrl)}
          disabled={isProcessing}
          className="text-red-500 text-sm hover:underline disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4 inline mr-1" />
          {t('categories.delete')}
        </button>
      </div>
    </li>
  );
};
