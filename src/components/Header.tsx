import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, Leaf, LogOut, Menu, User, Shield } from "lucide-react";
import { logout as logoutAction } from "../store/slices/authSlice";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../store/api/authApi";
import { RootState } from "../store/store";

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  isAuthenticated: boolean;
}

export default function Header({
  cartItemsCount,
  onCartClick,
  isAuthenticated,
}: HeaderProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAction());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-emerald-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8" />
            <h1 className="text-2xl font-bold">{t("header.title")}</h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onCartClick}
              className="flex items-center space-x-2 bg-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="font-semibold">{cartItemsCount}</span>
            </button>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 bg-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors"
                >
                  <User className="h-6 w-6" />
                  <span className="font-semibold">{t("header.dashboard")}</span>
                </Link>

                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 bg-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors"
                  >
                    <Shield  className="h-6 w-6"/>
                    <span className="font-semibold">{t('admin-panel')}</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors"
                >
                  <LogOut className="h-6 w-6" />
                  <span className="font-semibold">{t("header.logout")}</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 bg-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors"
              >
                <User className="h-6 w-6" />
                <span className="font-semibold">{t("header.login")}</span>
              </Link>
            )}
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-emerald-700 rounded-lg"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        cartItemsCount={cartItemsCount}
        onCartClick={() => {
          onCartClick();
          setIsMobileMenuOpen(false);
        }}
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
      />
    </header>
  );
}
