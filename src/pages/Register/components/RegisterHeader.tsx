import { UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function RegisterHeader() {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <UserPlus className="mx-auto h-12 w-12 text-emerald-600" />
      <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
        {t('auth.register.title')}
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        {t('auth.register.login')}{' '}
        <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
          {t('auth.login.title')}
        </Link>
      </p>
    </div>
  );
}
