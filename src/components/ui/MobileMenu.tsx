import { ShoppingCart, LogOut, X, User, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from '@/utils/motionComponents';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import AdminLink from '@/shared/headerFolder/AdminLinks';
import { UserLinks } from '@/shared/headerFolder/UserLinks';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  cartItemsCount: number;
  onCartClick: () => void;
  onLogout: () => void;
  isAuthenticated: boolean;
}

export default function MobileMenu({
  isOpen,
  onClose,
  cartItemsCount,
  onCartClick,
  onLogout,
  isAuthenticated,
}: MobileMenuProps) {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === 'admin';
  const isSeller = user?.role === 'seller';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-64 bg-emerald-600 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-emerald-700 rounded-lg"
              >
                <X className="h-6 w-6" />
              </motion.button>

              <div className="mt-12 space-y-6">
                <div className="flex justify-center">
                  <LanguageSwitcher />
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCartClick}
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-700 px-4 py-3 rounded-lg hover:bg-emerald-800 transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span className="font-semibold">{t('header.cart')}</span>
                  <span className="bg-emerald-500 px-2 py-1 rounded-full text-sm">
                    {cartItemsCount}
                  </span>
                </motion.button>

                {isAuthenticated ? (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isAdmin ? (
                        <AdminLink />
                      ) : isSeller ? (
                        <Link
                          to="/seller"
                          className="flex items-center space-x-1 text-white hover:text-emerald-200"
                        >
                          <Package className="h-4 w-4" />
                          <span>
                            {t('seller.dashboard.title', {
                              defaultValue: 'Панель продавца',
                            })}
                          </span>
                        </Link>
                      ) : (
                        <UserLinks
                          cartItemsCount={cartItemsCount}
                          onCartClick={onCartClick}
                        />
                      )}

                      {/* <Link
                        to="/dashboard"
                        className="w-full flex items-center justify-center space-x-2 bg-emerald-700 px-4 py-3 rounded-lg hover:bg-emerald-800 transition-colors"
                        onClick={onClose}
                      >
                        <User className="h-6 w-6" />
                        <span className="font-semibold">
                          {t('header.dashboard')}
                        </span>
                      </Link> */}
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        onLogout();
                        onClose();
                      }}
                      className="w-full flex items-center justify-center space-x-2 bg-emerald-700 px-4 py-3 rounded-lg hover:bg-emerald-800 transition-colors"
                    >
                      <LogOut className="h-6 w-6" />
                      <span className="font-semibold">
                        {t('header.logout')}
                      </span>
                    </motion.button>
                  </>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center space-x-2 bg-emerald-700 px-4 py-3 rounded-lg hover:bg-emerald-800 transition-colors"
                      onClick={onClose}
                    >
                      <User className="h-6 w-6" />
                      <span className="font-semibold">{t('header.login')}</span>
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
