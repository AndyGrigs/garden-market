import { createApi } from '@reduxjs/toolkit/query/react';
import { appBaseQuery } from './appBaseQuery';

export interface CreatePayPalOrderRequest {
  orderId: string;
  amount: number;
  currency?: string;
}

export interface PayPalOrderResponse {
  success: boolean;
  paypalOrderId: string;
  approveLink: string;
  paymentId: string;
}

export interface CapturePaymentRequest {
  paypalOrderId: string;
}

export interface CreateRunPayRequest {
  orderId: string;
  amount: number;
  currency?: string;
}

export interface RunPayResponse {
  success: boolean;
  paymentUrl: string;
  paymentId: string;
  message?: string;
}

export interface CreatePayNetRequest {
  orderId: string;
  amount: number;
  customerInfo: {
    name: string;
    email?: string;
  };
}

export interface PayNetResponse {
  success: boolean;
  paymentForm: string;
  paymentUrl: string;
  paymentId: string;
  message?: string;
}

export interface CreateStripeIntentRequest {
  orderId: string;
  amount: number;
  currency?: string;
  customerInfo: {
    name: string;
    email?: string;
  };
}

export interface StripeIntentResponse {
  success: boolean;
  clientSecret: string;
  paymentId: string;
}

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: appBaseQuery,
  tagTypes: ['Payment'],
  endpoints: (builder) => ({
    createPayPalOrder: builder.mutation<
      PayPalOrderResponse,
      CreatePayPalOrderRequest
    >({
      query: (data) => ({
        url: '/payments/paypal/create-order',
        method: 'POST',
        body: data,
      }),
    }),
    capturePayPalPayment: builder.mutation<unknown, CapturePaymentRequest>({
      query: (data) => ({
        url: '/payments/paypal/capture',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payment'],
    }),
    createRunPayPayment: builder.mutation<RunPayResponse, CreateRunPayRequest>({
      query: (data) => ({
        url: '/payments/runpay/create',
        method: 'POST',
        body: data,
      }),
    }),

    createPayNetPayment: builder.mutation<PayNetResponse, CreatePayNetRequest>({
      query: (data) => ({
        url: '/payments/paynet/create',
        method: 'POST',
        body: data,
      }),
    }),

    createStripePaymentIntent: builder.mutation<
      StripeIntentResponse,
      CreateStripeIntentRequest
    >({
      query: (data) => ({
        url: '/payments/stripe/create-intent',
        method: 'POST',
        body: data,
      }),
    }),

    confirmStripePayment: builder.mutation<
      unknown,
      { paymentIntentId: string }
    >({
      query: (data) => ({
        url: '/payments/stripe/confirm',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payment'],
    }),
  }),
});

export const {
  useCreatePayPalOrderMutation,
  useCapturePayPalPaymentMutation,
  useCreateRunPayPaymentMutation,
  useCreatePayNetPaymentMutation,
  useCreateStripePaymentIntentMutation,
  useConfirmStripePaymentMutation,
} = paymentApi;
