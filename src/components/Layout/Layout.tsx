import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header';
import { useSelector } from 'react-redux';
import { RootState, useAppSelector } from '../../store/store';
import { useState } from 'react';
import { AnimatePresence } from '@/utils/motionComponents';
import Cart from '@/features/buyer/components/Cart';
import { useGetTreesQuery } from '../../store/api/treesApi';
import { useGetCategoriesQuery } from '../../store/api/categoryApi';
import { useGetReviewsQuery } from '@/features/buyer/api/reviewApi';

export default function Layout() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
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
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={cartItemsCount}
        onCartClick={() => setIsCartOpen(true)}
        isAuthenticated={isAuthenticated}
        onCategoryFilterClick={() => setIsCategoryFilterOpen(true)}
        showCategoryFilter={showCategoryFilter}
      />

      <main>
        <Outlet context={{
          isCategoryFilterOpen,
          setIsCategoryFilterOpen
        }} />
      </main>

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