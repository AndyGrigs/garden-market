import React, { useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const OrderSuccessPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Redirect if no order ID
    if (!orderId) {
      navigate('/');
    }

    // Clear cart from localStorage (if you're using it)
    // localStorage.removeItem('cart');

    // Send analytics event (if implemented)
    // analytics.track('purchase_completed', { orderId });
  }, [orderId, navigate]);

  if (!orderId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
            <svg
              className="h-16 w-16 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('payment.success.title')}
          </h1>
          <p className="text-gray-600 mb-2">
            {t('payment.success.thank_you')}
          </p>

          {/* Order Info */}
          <div className="my-6 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 mb-1">
              {t('payment.success.order_number')}
            </p>
            <p className="text-xl font-bold text-gray-900">{orderId}</p>
          </div>

          <p className="text-sm text-gray-600 mb-8">
            {t('payment.success.confirmation_email')}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200"
            >
              {t('payment.success.view_orders')}
            </Link>
            <Link
              to="/"
              className="block w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-md border border-gray-300 transition-colors duration-200"
            >
              {t('payment.success.back_to_home')}
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              {t('payment.success.need_help')}{' '}
              <Link to="/contact" className="text-green-600 hover:text-green-700 underline">
                {t('payment.success.contact_us')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
