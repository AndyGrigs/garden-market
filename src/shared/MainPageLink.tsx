import { useTranslation } from 'react-i18next';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const MainPageLink = () => {
  const {t} = useTranslation();
  return (
    <Link
      to="/"
      className="fixed right-4 top-20 z-50 flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-gray-100 hover:shadow-lg transition-all duration-200 md:right-6"
      aria-label={t('common.toMain')}
    >
      <Home className="h-5 w-5 flex-shrink-0" />
      <span className="hidden md:inline-block whitespace-nowrap">{t('common.toMain')}</span>
    </Link>
  );
};

export default MainPageLink;
