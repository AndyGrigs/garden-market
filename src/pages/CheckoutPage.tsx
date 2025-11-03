import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StripeProvider } from '../contexts/StripeContext';
import { StripeCheckoutForm } from '../components/StripeCheckoutForm';
import type { ConfirmStripePaymentResponse } from '../store/api/paymentsApi';

export const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get order details from URL params or state
  const orderId = searchParams.get('orderId') || '';
  const amount = parseFloat(searchParams.get('amount') || '0');
  const currency = searchParams.get('currency') || 'EUR';

  useEffect(() => {
    // Redirect if no order info
    if (!orderId || !amount) {
      navigate('/');
    }
  }, [orderId, amount, navigate]);

  const handlePaymentSuccess = (data: ConfirmStripePaymentResponse) => {
    console.log('Payment successful!', data);
    // Redirect to success page
    navigate(`/order-success?orderId=${orderId}`);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    // Error is already displayed in the form
  };

  if (!orderId || !amount) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('payment.checkout_title')}
          </h1>
          <p className="text-gray-600">
            {t('payment.checkout_description')}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{t('payment.order_summary')}</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('payment.order_id')}:</span>
              <span className="font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600">{t('payment.total')}:</span>
              <span className="text-2xl font-bold text-green-600">
                {amount} {currency}
              </span>
            </div>
          </div>
        </div>

        <StripeProvider>
          <StripeCheckoutForm
            orderId={orderId}
            amount={amount}
            currency={currency}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </StripeProvider>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800 underline"
          >
            {t('payment.back_to_cart')}
          </button>
        </div>
      </div>
    </div>
  );
};
