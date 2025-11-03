import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useState } from 'react';
import { CartItem } from '../../types';
import { AnimatePresence } from 'framer-motion';
import Cart from '../Features/Cart/Cart';

export default function Layout() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const location = useLocation();

  // Only show category filter on homepage
  const showCategoryFilter = location.pathname === '/';

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        isAuthenticated={isAuthenticated}
        onCategoryFilterClick={() => setIsCategoryFilterOpen(true)}
        showCategoryFilter={showCategoryFilter}
      />

      <main>
        <Outlet context={{
          cartItems,
          setCartItems,
          isCategoryFilterOpen,
          setIsCategoryFilterOpen
        }} />
      </main>

      <AnimatePresence>
        {isCartOpen && (
          <Cart
            items={cartItems}
            onClose={() => setIsCartOpen(false)}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
          />
        )}
      </AnimatePresence>
    </div>
  );
}