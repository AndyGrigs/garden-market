import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterSidebar } from './FilterSidebar';
import { ProductGrid } from './ProductGrid';
import type { HomePageFilters } from '../hooks/useHomePage';
import { Tree } from '@/types/ITree';

interface ResponsiveFilterLayoutProps {
  filters: HomePageFilters;
  onChange: (filters: Partial<HomePageFilters>) => void;
  products: Tree[];
  isLoading: boolean;
  isCategoryFilterOpen?: boolean;
  onCategoryFilterClose?: () => void;
}

export const ResponsiveFilterLayout = ({
  filters,
  onChange,
  products,
  isLoading,
  isCategoryFilterOpen,
  onCategoryFilterClose
}: ResponsiveFilterLayoutProps) => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync with external state (from SubHeader "Все категории" button)
  useEffect(() => {
    if (isCategoryFilterOpen) {
      setSidebarOpen(true);
      onCategoryFilterClose?.();
    }
  }, [isCategoryFilterOpen, onCategoryFilterClose]);

  return (
    <div className="w-full">
      {/* Mobile/tablet filter button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors"
        >
          <span className="font-medium">{t('filters.showFilters')}</span>
          <svg
            className={`w-5 h-5 ml-2 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`}
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
      </div>

      <div className="flex gap-8">
        {/* Sidebar - hidden on mobile unless open */}
        <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block lg:w-64 flex-shrink-0`}>
          <FilterSidebar filters={filters} onChange={onChange} />
        </div>

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Product Grid */}
        <div className={`${sidebarOpen ? 'hidden' : 'block'} lg:block flex-1`}>
          <ProductGrid products={products} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};