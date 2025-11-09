import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useResetPasswordMutation } from '../store/api/authApi';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { ErrorResponse } from '../types/IUser';
import { useTranslation } from 'react-i18next';
import MainPageLink from '../shared/MainPageLink';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const codeFromUrl = searchParams.get('code');
  const [code, setCode] = useState(codeFromUrl || '');
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  
  const email = searchParams.get('email');
  const { t } = useTranslation();

  useEffect(() => {
    if (!email) {
      setError('Invalid or missing email');
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !code) {
      setError('Invalid email or code');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await resetPassword({
        email,
        code,
        newPassword: password,
      }).unwrap();
      setMessage(response.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: ErrorResponse | unknown) {
      setError(
        (err as ErrorResponse)?.data?.message ||
          'Failed to reset password. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <MainPageLink />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-emerald-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t('auth.resetPassword.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('auth.resetPassword.subtitle')}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md"
              >
                {message}
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

            <div>
              <label
                htmlFor="verificationCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t('auth.resetPassword.verificationCode')}
              </label>
              <input
                id="verificationCode"
                name="verificationCode"
                type="text"
                required
                value={code || ''}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-center text-lg font-mono tracking-widest"
                placeholder={t(
                  'auth.resetPassword.verificationCodePlaceholder'
                )}
                maxLength={3}
                pattern="[0-9]{3}"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t('auth.resetPassword.newPassword')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder={t('auth.resetPassword.newPasswordPlaceholder')}
                minLength={6}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t('auth.resetPassword.confirmPassword')}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
                minLength={6}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !email || !code}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  t('auth.resetPassword.submit')
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('auth.resetPassword.backToLogin')}{' '}
              <Link
                to="/login"
                className="font-medium text-emerald-600 hover:text-emerald-500"
              >
                {t('auth.login.title')}
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
