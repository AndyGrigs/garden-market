import { createApi } from '@reduxjs/toolkit/query/react';

import { appBaseQuery } from '@/store/api/appBaseQuery';
import { CreateOrderRequest, Order } from '@/types/IOrders';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: appBaseQuery,
  tagTypes: ['Order'],
  keepUnusedDataFor: 180,
  endpoints: (builder) => ({
    getUserOrders: builder.query<Order[], string>({
      query: (userId) => `/orders/user/${userId}`,
      providesTags: ['Order'],
    }),
    createOrder: builder.mutation<
      { success: boolean; order: Order; message: string },
      CreateOrderRequest
    >({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order'],
    }),

    getAllOrders: builder.query<
      {
        orders: Order[];
        totalPages: number;
        currentPage: number;
        total: number;
      },
      { status?: string; paymentStatus?: string; page?: number; limit?: number }
    >({
      query: (params) => ({
        url: '/orders',
        params,
      }),
      providesTags: ['Order'],
    }),

    updateOrderStatus: builder.mutation<
      { success: boolean; order: Order },
      {
        id: string;
        status?: string;
        paymentsStatus?: string;
        adminNotes?: string;
      }
    >({
      query: ({ id, ...data }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useGetUserOrdersQuery,
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} = orderApi;
