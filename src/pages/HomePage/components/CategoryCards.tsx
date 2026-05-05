import { useGetCategoriesQuery } from '@/store/api/categoryApi';
import { useTranslation } from 'react-i18next';
import { BASE_URL } from '@/config';
import { getCategoryName } from '@/shared/helpers/getCategoryName';

interface CategoryCardsProps {
  selectedCategoryId: string | null;
  onCategorySelect: (id: string | null) => void;
}

export default function CategoryCards({ selectedCategoryId, onCategorySelect }: CategoryCardsProps) {
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const { i18n } = useTranslation();

  if (isLoading || !categories) return null;

  return (
    <div className="bg-stone-100/80 border-y border-stone-200 py-4 px-4">
      <div className="container mx-auto">
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide justify-center flex-wrap">
          {categories.map((category) => {
            const imageUrl = category.imageUrl?.startsWith('http')
              ? category.imageUrl
              : `${BASE_URL}${category.imageUrl}`;
            const name = getCategoryName(category, i18n.language);
            const isSelected = selectedCategoryId === category._id;

            return (
              <button
                key={category._id}
                onClick={() => onCategorySelect(isSelected ? null : category._id)}
                className={`flex flex-col items-center rounded-xl overflow-hidden min-w-[120px] max-w-[140px] border-2 transition-all shadow-sm hover:shadow-md
                  ${isSelected
                    ? 'border-emerald-500 scale-105'
                    : 'border-stone-200 hover:border-emerald-300'
                  } bg-white`}
              >
                <div className="w-full h-[90px] overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-2 py-2 text-center bg-amber-50 w-full">
                  <span className="text-xs font-semibold text-stone-700 leading-tight">{name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}