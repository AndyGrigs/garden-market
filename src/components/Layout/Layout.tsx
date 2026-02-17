import { Outlet, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import Header from '../Header';
import Footer from '../Footer';
import { useAppSelector } from '../../store/store';
import { useState } from 'react';
import { AnimatePresence } from '@/utils/motionComponents';
import Cart from '@/features/buyer/components/Cart';
import { useGetTreesQuery } from '../../store/api/treesApi';
import { useGetCategoriesQuery } from '../../store/api/categoryApi';
import { useGetReviewsQuery } from '@/features/buyer/api/reviewApi';

export default function Layout() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const cartItems = useAppSelector((state) => state.cart.items);
  const location = useLocation();

  // Preload critical data - це закешує дані для швидкого доступу
  // RTK Query автоматично дедуплікує запити та кешує результати
  useGetTreesQuery();
  useGetCategoriesQuery();
  useGetReviewsQuery();

  // Only show category filter on homepage
  const showCategoryFilter = location.pathname === '/';

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header
        cartItemsCount={cartItemsCount}
        onCartClick={() => setIsCartOpen(true)}
        isAuthenticated={isAuthenticated}
        onCategoryFilterClick={() => setIsCategoryFilterOpen(true)}
        showCategoryFilter={showCategoryFilter}
      />

      <main className="flex-1">
        <Outlet context={{
          isCategoryFilterOpen,
          setIsCategoryFilterOpen
        }} />
      </main>

      <Footer />

      {/* Fixed floating cart button - mobile only */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center space-x-2 bg-emerald-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
      >
        <ShoppingCart className="h-6 w-6" />
        {cartItemsCount > 0 && (
          <span className="bg-emerald-800 px-2 py-0.5 rounded-full text-sm font-semibold">
            {cartItemsCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isCartOpen && (
          <Cart
            onClose={() => setIsCartOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}