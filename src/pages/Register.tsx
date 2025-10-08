import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation } from '../store/api/authApi';
import { UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import { ErrorResponse } from '../types/IUser';
import MainPageLink from '../shared/MainPageLink';
import TermsModal from '../components/ui/TermsModal';
import RoleSelector from '../shared/register/RoleSelector';
import BasicInfoFields from '../shared/register/BasicInfoFields';
import SellerInfoFields from '../shared/register/SellerInfoFields';
import TermsCheckbox from '../shared/register/TermsCheckbox';
import toast from 'react-hot-toast';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [sellerInfo, setSellerInfo] = useState({
    nurseryName: '',
    address: '',
    phoneNumber: '',
    businessLicense: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { t, i18n } = useTranslation();

  const detectedLanguage =
    i18n.language || navigator.language.split('-')[0] || 'en';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (role === 'seller') {
      if (!sellerInfo.nurseryName.trim()) {
        setError(t('verification.nursery'));
        toast.error(t('verification.nursery'))
        return;
      }
      /**Romanian:   Russian:  */
      if (!sellerInfo.phoneNumber.trim()) {
        setError(t('verification.sellerPhone'));
        toast.error(t('verification.sellerPhone'))
        return;
      }
    }

    if (!termsAccepted) {
      setError(t('verification.sellerAccept'));
      toast.error(t('verification.sellerAccept'))
      return;
    }

    try {
      const registerData = {
        fullName,
        email,
        password,
        language: detectedLanguage,
        role,
        termsAccepted,
        ...(role === 'seller' && { sellerInfo }),
      };
      console.log('📤 Відправляємо дані:', registerData);
      const result = await register(registerData).unwrap();

      setSuccess(result.message);
      setTimeout(() => {
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
      }, 4000);
    } catch (err: ErrorResponse | unknown) {
      setError(
        (err as ErrorResponse)?.data?.message || t('auth.register.error')
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={0}
        onCartClick={() => {}}
        isAuthenticated={false}
      />

      <div className="relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-4 right-4">
          <MainPageLink />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full space-y-8"
        >
          <div className="text-center">
            <UserPlus className="mx-auto h-12 w-12 text-emerald-600" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {t('auth.register.title')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t('auth.register.login')}{' '}
              <Link
                to="/login"
                className="font-medium text-emerald-600 hover:text-emerald-500"
              >
                {t('auth.login.title')}
              </Link>
            </p>
          </div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
          >
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md"
              >
                {success}
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md"
              >
                {error}
              </motion.div>
            )}

            {/* Вибір ролі */}
            <RoleSelector role={role} onRoleChange={setRole} />

            {/* Основні поля */}
            <BasicInfoFields
              fullName={fullName}
              email={email}
              password={password}
              onFullNameChange={setFullName}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
            />
            {/* Додаткові поля для продавців */}
            {role === 'seller' && (
              <SellerInfoFields
                sellerInfo={sellerInfo}
                onSellerInfoChange={setSellerInfo}
              />
            )}

            {/* Чекбокс прийняття умов */}
            <TermsCheckbox
              checked={termsAccepted}
              onCheckChange={setTermsAccepted}
              onOpenModal={() => setShowTermsModal(true)}
            />

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="rounded-full h-5 w-5 border-b-2 border-white"
                  />
                ) : (
                  t('auth.register.submit')
                )}
              </button>
            </div>
          </motion.form>
        </motion.div>
      </div>
      {/* Модальне вікно з умовами */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => {
          setTermsAccepted(true);
          setShowTermsModal(false);
        }}
      />
    </div>
  );
}
