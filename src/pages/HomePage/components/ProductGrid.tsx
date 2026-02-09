
import { useTranslation } from 'react-i18next';
import { ProductCard } from '@/features/products/components/ProductCard';
import { Spinner } from '@/shared/ui/Spinner';
import { Tree } from '@/types/ITree';

interface ProductGridProps {
  products: Tree[];
  isLoading: boolean;
}

export const ProductGrid = ({ products, isLoading }: ProductGridProps) => {
  const { t } = useTranslation();



  if (isLoading) {
    return <Spinner />;
  }

  if (!products?.length) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <svg
            className="mx-auto h-24 w-24 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {t('products.noResults')}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {t('products.noResultsDescription')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-600">
          {t('products.found')}: <span className="font-semibold">{products.length}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};
