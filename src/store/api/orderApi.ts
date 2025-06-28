import { createApi } from "@reduxjs/toolkit/query/react";

import { appBaseQuery } from './appBaseQuery';
import { Order } from '../../types/IOrders';

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: appBaseQuery,
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    getUserOrders: builder.query<Order[], string>({
      query: (userId) => `/orders/user/${userId}`,
      providesTags: ["Order"],
    }),
    createOrder: builder.mutation<Order, Partial<Order>>({
      query: (orderData) => ({
        url: "/orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useGetUserOrdersQuery,
  useCreateOrderMutation,
} = orderApi;