import { useTranslation } from 'react-i18next';
import { Tree } from '@/types/ITree';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';

interface ProductCardProps {
  product: Tree;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language as 'ru' | 'ro';
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const categoryName =
    typeof product.category === 'object' && product.category !== null
      ? product.category.name?.[currentLang]
      : '';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Зображення */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title[currentLang]}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Бейдж наявності */}
        {product.stock > 0 ? (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            {t('product.inStock')}
          </span>
        ) : (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {t('product.outOfStock')}
          </span>
        )}
      </div>

      {/* Контент */}
      <div className="p-4">
        {/* Категорія */}
        {categoryName && (
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {categoryName}
          </span>
        )}

        {/* Назва */}
        <h3 className="text-lg font-semibold text-gray-800 mt-1 mb-2 line-clamp-2 h-14">
          {product.title[currentLang]}
        </h3>

        {/* Опис */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">
          {product.description[currentLang]}
        </p>

        {/* Ціна та кнопка */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-green-600">
              {product.price} MDL
            </span>
            {product.stock > 0 && (
              <span className="text-xs text-gray-500">
                {t('product.stock')}: {product.stock}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              product.stock > 0
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {product.stock > 0 ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            ) : (
              t('product.unavailable')
            )}
          </button>
        </div>

        {/* Продавець */}
        {product.seller && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <span className="text-xs text-gray-500">
              {t('product.seller')}:{' '}
              <span className="font-medium text-gray-700">
                {product.seller.sellerInfo?.nurseryName || product.seller.fullName}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
