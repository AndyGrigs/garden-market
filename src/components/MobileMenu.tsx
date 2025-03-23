import React from 'react';
import { ShoppingCart, LogOut, X, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { Link } from 'react-router-dom';

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

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="fixed inset-y-0 right-0 w-64 bg-emerald-600 shadow-lg">
        <div className="p-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-emerald-700 rounded-lg"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="mt-12 space-y-6">
            <div className="flex justify-center">
              <LanguageSwitcher />
            </div>

            <button
              onClick={onCartClick}
              className="w-full flex items-center justify-center space-x-2 bg-emerald-700 px-4 py-3 rounded-lg hover:bg-emerald-800 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="font-semibold">{t('header.cart')}</span>
              <span className="bg-emerald-500 px-2 py-1 rounded-full text-sm">
                {cartItemsCount}
              </span>
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-700 px-4 py-3 rounded-lg hover:bg-emerald-800 transition-colors"
                  onClick={onClose}
                >
                  <User className="h-6 w-6" />
                  <span className="font-semibold">{t('header.dashboard')}</span>
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-700 px-4 py-3 rounded-lg hover:bg-emerald-800 transition-colors"
                >
                  <LogOut className="h-6 w-6" />
                  <span className="font-semibold">{t('header.logout')}</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="w-full flex items-center justify-center space-x-2 bg-emerald-700 px-4 py-3 rounded-lg hover:bg-emerald-800 transition-colors"
                onClick={onClose}
              >
                <User className="h-6 w-6" />
                <span className="font-semibold">{t('header.login')}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}