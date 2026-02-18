import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface PageConfig {
  title: string;
  description?: string;
}

const pageConfigs: Record<string, PageConfig> = {
  '/': {
    title: 'header.home',
    description: 'header.homeDescription',
  },
  '/about': {
    title: 'header.about',
    description: 'header.aboutDescription',
  },
  '/contact': {
    title: 'header.contact',
    description: 'header.contactDescription',
  },
  '/reviews': {
    title: 'reviews.allReviews',
    description: 'header.reviewsDescription',
  },
  '/login': {
    title: 'header.login',
    description: 'header.loginDescription',
  },
  '/register': {
    title: 'header.register',
    description: 'header.registerDescription',
  },
  '/dashboard': {
    title: 'header.dashboard',
    description: 'header.dashboardDescription',
  },
  '/admin': {
    title: 'admin.title',
    description: 'admin.description',
  },
  '/terms': {
    title: 'terms.title',
    description: 'terms.description',
  },
  '/order-success': {
    title: 'order.success',
    description: 'order.successDescription',
  },
  '/reset-password': {
    title: 'auth.resetPassword',
    description: 'auth.resetPasswordDescription',
  },
  '/verify-email': {
    title: 'auth.verifyEmail',
    description: 'auth.verifyEmailDescription',
  },
};

export default function PageHeader() {
  const location = useLocation();
  const { t } = useTranslation();

  // Finde die passende Konfiguration für die aktuelle Route
  const config = pageConfigs[location.pathname] || {
    title: 'header.home',
    description: 'header.homeDescription',
  };

  return (
    <>
      {/* Page Title Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-emerald-800 text-white py-6"
      >
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold">
            {t(config.title, { defaultValue: config.title })}
          </h1>
          {config.description && (
            <p className="text-emerald-200 mt-2 text-sm md:text-base">
              {t(config.description, { defaultValue: '' })}
            </p>
          )}
        </div>
      </motion.div>

    </>
  );
}
