// ✅ ЩО ТУТ:
// - Приймає props (filters, onChange)
// - Рендерить UI фільтрів
// - Викликає callback при зміні
// - Локальний стан для UI (відкриті/закриті секції)

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';
import type { HomePageFilters } from '../hooks/useHomePage';
import { CURRENCY } from '@/config';

interface FilterSidebarProps {
  filters: HomePageFilters;
  onChange: (filters: Partial<HomePageFilters>) => void;
}

export const FilterSidebar = ({ filters, onChange }: FilterSidebarProps) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as 'ru' | 'ro';

  // ✅ Локальний UI стан
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isStockOpen, setIsStockOpen] = useState(true);

  // Завантаження категорій
  const { data: categories, isLoading } = useGetCategoriesQuery();

  // ❌ НЕ робити: API виклики, useEffect з бізнес-логікою

  // ✅ Обробники для UI
  const handleCategoryChange = (categoryId: string | null) => {
    onChange({ categoryId });
  };

  const handlePriceChange = (range: [number, number]) => {
    onChange({ priceRange: range });
  };

  const handleStockChange = (inStock: boolean) => {
    onChange({ inStock });
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    handlePriceChange([value, filters.priceRange[1]]);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    handlePriceChange([filters.priceRange[0], value]);
  };

  return (
    <aside className="w-full md:w-64 bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
      <h2 className="text-xl font-bold mb-6 text-gray-800">
        {t('filters.title')}
      </h2>

      {/* Категорії */}
      <div className="mb-6 border-b pb-4">
        <button
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-700 mb-3"
        >
          <span>{t('filters.categories')}</span>
          <svg
            className={`w-5 h-5 transition-transform ${
              isCategoryOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isCategoryOpen && (
          <div className="space-y-2">
            {/* Всі категорії */}
            <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="radio"
                name="category"
                checked={filters.categoryId === null}
                onChange={() => handleCategoryChange(null)}
                className="w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <span className="text-gray-700">{t('filters.allCategories')}</span>
            </label>

            {/* Список категорій */}
            {isLoading ? (
              <div className="text-sm text-gray-500 p-2">
                {t('common.loading')}...
              </div>
            ) : (
              categories?.map((category) => (
                <label
                  key={category._id}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="radio"
                    name="category"
                    checked={filters.categoryId === category._id}
                    onChange={() => handleCategoryChange(category._id)}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-700">
                    {category.name[currentLang]}
                  </span>
                </label>
              ))
            )}
          </div>
        )}
      </div>

      {/* Ціна */}
      <div className="mb-6 border-b pb-4">
        <button
          onClick={() => setIsPriceOpen(!isPriceOpen)}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-700 mb-3"
        >
          <span>{t('filters.price')}</span>
          <svg
            className={`w-5 h-5 transition-transform ${
              isPriceOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isPriceOpen && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                value={filters.priceRange[0]}
                onChange={handleMinPriceChange}
                placeholder={t('filters.minPrice')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                min="0"
                value={filters.priceRange[1]}
                onChange={handleMaxPriceChange}
                placeholder={t('filters.maxPrice')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="text-sm text-gray-600">
              {filters.priceRange[0]} - {filters.priceRange[1]} {CURRENCY}
            </div>
          </div>
        )}
      </div>

      {/* Наявність */}
      <div className="mb-4">
        <button
          onClick={() => setIsStockOpen(!isStockOpen)}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-700 mb-3"
        >
          <span>{t('filters.availability')}</span>
          <svg
            className={`w-5 h-5 transition-transform ${
              isStockOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isStockOpen && (
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => handleStockChange(e.target.checked)}
                className="w-4 h-4 text-green-600 focus:ring-green-500 rounded"
              />
              <span className="text-gray-700">{t('filters.inStockOnly')}</span>
            </label>
          </div>
        )}
      </div>

      {/* Кнопка очищення фільтрів */}
      <button
        onClick={() =>
          onChange({
            categoryId: null,
            priceRange: [0, 1000],
            inStock: true,
          })
        }
        className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
      >
        {t('filters.reset')}
      </button>
    </aside>
  );
};
