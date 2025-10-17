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

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: appBaseQuery,
  tagTypes: ['Payment'],
  endpoints: (builder) => ({
    createPayPalOrder: builder.mutation<PayPalOrderResponse, CreatePayPalOrderRequest>({
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
  }),
});

export const {
  useCreatePayPalOrderMutation,
  useCapturePayPalPaymentMutation,
} = paymentApi;