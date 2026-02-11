import { Home, Info, Mail, MessageCircle, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface SubHeaderProps {
  onCategoryFilterClick?: () => void;
  showCategoryFilter?: boolean;
}

export default function SubHeader({ onCategoryFilterClick, showCategoryFilter = false }: SubHeaderProps) {
  const { t } = useTranslation();

  // Scroll to products section on desktop
  const handleDesktopFilterClick = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Open mobile sidebar
  const handleMobileFilterClick = () => {
    if (onCategoryFilterClick) {
      onCategoryFilterClick();
    }
  };

  return (
    <div className="bg-emerald-700 text-white border-t border-emerald-600">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          {/* Left Side - Quick Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <Link
              to="/"
              className="flex items-center space-x-1 hover:text-emerald-200 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>{t('footer.home')}</span>
            </Link>
            <Link
              to="/about"
              className="flex items-center space-x-1 hover:text-emerald-200 transition-colors"
            >
              <Info className="h-4 w-4" />
              <span>{t('footer.about')}</span>
            </Link>
            <Link
              to="/contact"
              className="flex items-center space-x-1 hover:text-emerald-200 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{t('footer.contact')}</span>
            </Link>
            <Link
              to="/reviews"
              className="flex items-center space-x-1 hover:text-emerald-200 transition-colors"
            >
              <span>{t('reviews.allReviews')}</span>
            </Link>
          </div>

          {/* Mobile/Tablet - Category Filter Button (Opens Sidebar) */}
          {showCategoryFilter && (
            <div className="lg:hidden">
              <button
                onClick={handleMobileFilterClick}
                className="flex items-center space-x-2 px-3 py-1.5 ml-3 hover:bg-emerald-800 rounded-md transition-colors text-sm"
              >
                {/* <Filter className="h-4 w-4" /> */}
                <span>{t('categories.all')}</span>
              </button>
            </div>
          )}

          {/* Right Side - Contact Info */}
          <div className="flex items-center space-x-4 text-sm ml-auto">
            {/* Desktop Category Filter (Scrolls to Products) */}
            {showCategoryFilter && (
              <button
                onClick={handleDesktopFilterClick}
                className="hidden lg:flex items-center space-x-2 px-3 py-1.5  hover:bg-emerald-800 rounded-md transition-colors"
              >
                {/* <Filter className="h-4 w-4" /> */}
                <span>{t('categories.all')}</span>
              </button>
            )}

            <a
              href="tel:+37379748131"
              className="hidden sm:flex items-center space-x-1 hover:text-emerald-200 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>+373 68 123 456</span>
            </a>
            <a
              href="mailto:market@covaci.md"
              className="hidden lg:flex items-center space-x-1 hover:text-emerald-200 transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>market@covaci.md</span>
            </a>

            {/* Mobile - Only show phone icon */}
            <a
              href="tel:37379748131"
              className="sm:hidden flex items-center hover:text-emerald-200 transition-colors"
            >
              <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
