import { useTranslation } from 'react-i18next';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const MainPageLink = () => {
  const {t} = useTranslation();
  return (
    <Link
      to="/"
      className=" fixed right-6 bottom-20 flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
    >
      <Home className="h-5 w-5" />
      <span>{t('common.toMain')}</span>
    </Link>
  );
};

export default MainPageLink;
