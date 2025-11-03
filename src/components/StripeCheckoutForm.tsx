import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import {
  useCreateStripePaymentIntentMutation,
  useConfirmStripePaymentMutation,
} from '../store/api/paymentsApi';
import type { StripeCheckoutFormProps } from '../types/stripe';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const ERROR_MESSAGES: Record<string, string> = {
  card_declined: 'payment.errors.card_declined',
  insufficient_funds: 'payment.errors.insufficient_funds',
  incorrect_cvc: 'payment.errors.incorrect_cvc',
  expired_card: 'payment.errors.expired_card',
  processing_error: 'payment.errors.processing_error',
  invalid_number: 'payment.errors.invalid_number',
};

export const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({
  orderId,
  amount,
  currency = 'EUR',
  onSuccess,
  onError,
}) => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();

  const [createIntent] = useCreateStripePaymentIntentMutation();
  const [confirmPayment] = useConfirmStripePaymentMutation();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardholderName, setCardholderName] = useState('');
  const [email, setEmail] = useState('');

  const getErrorMessage = (errorCode: string, defaultMessage: string): string => {
    const translationKey = ERROR_MESSAGES[errorCode];
    if (translationKey) {
      return t(translationKey);
    }
    return defaultMessage;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!cardholderName.trim()) {
      setError(t('payment.errors.name_required'));
      return;
    }

    if (!email.trim()) {
      setError(t('payment.errors.email_required'));
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Step 1: Create Payment Intent
      const intentResponse = await createIntent({
        orderId,
        amount,
        currency,
        customerInfo: {
          name: cardholderName,
          email,
        },
      }).unwrap();

      const { clientSecret, paymentId } = intentResponse;

      // Step 2: Confirm payment with Stripe
      const cardElement = elements.getElement(CardNumberElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: cardholderName,
              email,
            },
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Step 3: Confirm on backend
      if (paymentIntent?.status === 'succeeded') {
        const confirmResponse = await confirmPayment({
          paymentIntentId: paymentIntent.id,
        }).unwrap();

        if (confirmResponse.success) {
          onSuccess?.(confirmResponse);
        }
      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.message ||
        getErrorMessage(err?.code, err?.message || t('payment.errors.unknown'));
      setError(errorMessage);
      onError?.(errorMessage);
      console.error('Payment error:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-checkout-form max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">{t('payment.card_payment')}</h3>

      <div className="mb-4">
        <label htmlFor="cardholder-name" className="block text-sm font-medium text-gray-700 mb-2">
          {t('payment.cardholder_name')}
        </label>
        <input
          id="cardholder-name"
          type="text"
          placeholder={t('payment.name_placeholder')}
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          {t('payment.email')}
        </label>
        <input
          id="email"
          type="email"
          placeholder={t('payment.email_placeholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('payment.card_number')}
        </label>
        <div className="w-full px-4 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent">
          <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('payment.expiry_date')}
          </label>
          <div className="w-full px-4 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent">
            <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('payment.cvc')}
          </label>
          <div className="w-full px-4 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent">
            <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">❌ {error}</p>
        </div>
      )}

      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-600">
          {t('payment.amount_to_pay')}: <strong className="text-lg text-gray-900">{amount} {currency}</strong>
        </p>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200"
      >
        {processing ? t('payment.processing') : `${t('payment.pay')} ${amount} ${currency}`}
      </button>

      <div className="mt-4 text-center text-sm text-gray-500">
        🔒 {t('payment.secured_by_stripe')}
      </div>
    </form>
  );
};
