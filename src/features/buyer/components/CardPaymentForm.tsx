import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Loader2, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from '@/utils/motionComponents';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
);

interface CardPaymentFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

function CheckoutForm({
  onSuccess,
  onError,
}: Omit<CardPaymentFormProps, 'clientSecret'>) {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message || 'Ошибка оплаты');
        toast.error(error.message || 'Ошибка оплаты');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast.success(
          t('checkout.success', { defaultValue: 'Оплата успешна!' })
        );
        onSuccess();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        onError(err.message);
      } else {
        onError('Payment error');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <PaymentElement
          options={{
            layout: 'tabs',
            defaultValues: {
              billingDetails: {
                // можна додати дефолтні значення
              },
            },
          }}
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-lg font-semibold flex items-center justify-center space-x-3 hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>
              {t('checkout.processing', { defaultValue: 'Обработка...' })}
            </span>
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            <span>
              {t('checkout.payNow', { defaultValue: 'Оплатить сейчас' })}
            </span>
          </>
        )}
      </motion.button>

      <p className="text-xs text-gray-500 text-center">
        {t('checkout.securePayment', {
          defaultValue: '🔒 Безопасный платеж через Stripe',
        })}
      </p>
    </form>
  );
}

export default function CardPaymentForm({
  clientSecret,
  onSuccess,
  onError,
}: CardPaymentFormProps) {
  const { t } = useTranslation();

  if (!clientSecret) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-600" />
        <p className="mt-2 text-gray-600">
          {t('checkout.preparingPayment', {
            defaultValue: 'Подготовка платежа...',
          })}
        </p>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#10b981',
            colorBackground: '#ffffff',
            colorText: '#1f2937',
            colorDanger: '#ef4444',
            fontFamily: 'system-ui, sans-serif',
            borderRadius: '8px',
          },
        },
      }}
    >
      <CheckoutForm onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}
