import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ShoppingCart, AlertCircle } from 'lucide-react';
import { useGetTreeByIdQuery } from '@/store/api/treesApi';
import { useTreeTitle, useTreeDescription } from '@/hooks/useTreeTranslations';
import { BASE_URL } from '@/config';
import { getCurrency } from '@/shared/helpers/getCurrency';
import { Tree } from '@/types/ITree';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { addToCart } from '@/store/slices/cartSlice';
import toast from 'react-hot-toast';

export default function TreeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const getTreeTitle = useTreeTitle();
  const getTreeDescription = useTreeDescription();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const { data: tree, isLoading, error } = useGetTreeByIdQuery(id || '');

  const handleAddToCart = (tree: Tree) => {
    const existingItem = cartItems.find((item) => item._id === tree._id);
    dispatch(addToCart({ ...tree, quantity: 1 }));
    if (existingItem) {
      toast.success(t('cart.notifications.addedAnother', { name: getTreeTitle(tree.title) }));
    } else {
      toast.success(t('cart.notifications.added', { name: getTreeTitle(tree.title) }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !tree) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {t('treeDetail.notFound')}
        </h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors"
        >
          {t('treeDetail.backToHome')}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        {t('treeDetail.back')}
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src={tree.imageUrl ? `${BASE_URL}${tree.imageUrl}` : '/placeholder.png'}
            alt={getTreeTitle(tree.title)}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {getTreeTitle(tree.title)}
          </h1>

          <div className="mb-6">
            <span className="text-4xl font-bold text-emerald-600">
              {tree.price.toFixed(2)} {getCurrency()}
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {t('treeDetail.description')}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {getTreeDescription(tree.description)}
            </p>
          </div>

          {tree.category && typeof tree.category === 'object' && tree.category.name && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {t('treeDetail.category')}
              </h3>
              <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
                {tree.category.name.ru || tree.category.name.ro}
              </span>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t('treeDetail.availability')}
            </h3>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm ${
                tree.stock > 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {tree.stock > 0
                ? `${t('treeDetail.inStock')} (${tree.stock})`
                : t('treeDetail.outOfStock')}
            </span>
          </div>

          {tree.seller && (
            <div className="mb-6 pb-6 border-b">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {t('treeDetail.seller')}
              </h3>
              <p className="text-gray-600">
                {tree.seller.sellerInfo?.nurseryName || tree.seller.fullName}
              </p>
            </div>
          )}

          <button
            onClick={() => handleAddToCart(tree)}
            disabled={tree.stock === 0}
            className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-white font-semibold transition-colors ${
              tree.stock > 0
                ? 'bg-emerald-600 hover:bg-emerald-500'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            {tree.stock > 0 ? t('tree.addToCart') : t('treeDetail.outOfStock')}
          </button>
        </div>
      </div>
    </div>
  );
}
