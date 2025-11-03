import React, { createContext, useContext, ReactNode } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useGetStripeConfigQuery } from '../store/api/paymentsApi';

interface StripeContextValue {
  stripePromise: Promise<Stripe | null> | null;
}

const StripeContext = createContext<StripeContextValue | undefined>(undefined);

export const useStripeContext = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripeContext must be used within StripeProvider');
  }
  return context;
};

interface StripeProviderProps {
  children: ReactNode;
}

export const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  const { data, isLoading, error } = useGetStripeConfigQuery();

  const stripePromise = React.useMemo(() => {
    if (data?.success && data.publishableKey) {
      return loadStripe(data.publishableKey);
    }
    return null;
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment system...</p>
        </div>
      </div>
    );
  }

  if (error || !stripePromise) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Payment System Error</p>
          <p>Unable to initialize payment system. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <StripeContext.Provider value={{ stripePromise }}>
      <Elements stripe={stripePromise}>
        {children}
      </Elements>
    </StripeContext.Provider>
  );
};
