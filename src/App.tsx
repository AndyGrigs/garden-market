import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Header from './components/Header';
import Footer from './components/Footer';
import TreeCard from './components/TreeCard';
import Cart from './components/Cart';
import ContactForm from './components/ContactForm';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { useGetTreesQuery } from './store/api/treesApi';
import { CartItem, ContactForm as IContactForm, Tree } from './types';
import { useState } from 'react';
import { MessageCircle, X, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { AnimatePresence, motion } from 'framer-motion';

function MainContent() {
  const { data: trees, isLoading, error } = useGetTreesQuery();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false
  });
  const { t } = useTranslation();
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.token);
  const location = useLocation();

  const showNotification = (message: string) => {
    setNotification({ message, visible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const addToCart = (tree: Tree) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === tree.id);
      if (existingItem) {
        showNotification(t('cart.notifications.addedAnother', { name: tree.name }));
        return prev.map((item) =>
          item.id === tree.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      showNotification(t('cart.notifications.added', { name: tree.name }));
      return [...prev, { ...tree, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      if (window.confirm(t('checkout.guestConfirm'))) {
        // Proceed with guest checkout
        alert(t('checkout.guestProcessing'));
      } else {
        // Redirect to login
        window.location.href = '/login';
      }
    } else {
      alert(t('checkout.processing'));
    }
  };

  const handleContactSubmit = (form: IContactForm) => {
    console.log('Contact form submitted:', form);
    alert(t('contact.success'));
    setIsContactOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        isAuthenticated={isAuthenticated}
      />

      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto px-4 py-8"
      >
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            {t('collection.title')}
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="rounded-full h-12 w-12 border-b-2 border-emerald-600"
              />
            </div>
          ) : error ? (
            <div className="text-center text-red-600">
              {t('collection.error')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trees?.map((tree, index) => (
                <motion.div
                  key={tree.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TreeCard
                    tree={tree}
                    onAddToCart={addToCart}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </motion.main>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsContactOpen(true)}
        className="fixed bottom-6 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-500 transition-colors duration-200 flex items-center justify-center"
        aria-label={t('contact.title')}
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>

      <Footer />

 

      <AnimatePresence>
        {notification.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-6 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2"
          >
            <CheckCircle className="h-5 w-5" />
            <span>{notification.message}</span>
          </motion.div>
        )}

        {isContactOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md relative"
            >
              <button
                onClick={() => setIsContactOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <span className="sr-only">Close</span>
                <X className="h-6 w-6" />
              </button>
              <div className="p-6">
                <ContactForm onSubmit={handleContactSubmit} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isCartOpen && (
        <Cart
          items={cartItems}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<MainContent />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AnimatedRoutes />
      </Router>
    </Provider>
  );
}

export default App;