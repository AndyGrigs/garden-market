export interface StripeConfig {
  success: boolean;
  publishableKey: string;
}

export interface CreatePaymentIntentRequest {
  orderId: string;
  amount: number;
  currency: string;
  customerInfo: {
    name: string;
    email: string;
  };
}

export interface CreatePaymentIntentResponse {
  success: boolean;
  clientSecret: string;
  paymentId: string;
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
}

export interface ConfirmPaymentResponse {
  success: boolean;
  payment: {
    id: string;
    orderId: string;
    status: string;
    amount: number;
    currency: string;
  };
}

export interface PaymentFormData {
  cardholderName: string;
  email: string;
}

export interface StripeCheckoutFormProps {
  orderId: string;
  amount: number;
  currency?: string;
  onSuccess?: (data: ConfirmPaymentResponse) => void;
  onError?: (error: string) => void;
}
