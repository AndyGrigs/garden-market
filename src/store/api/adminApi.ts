import { createApi } from "@reduxjs/toolkit/query/react";
import { appBaseQuery } from './appBaseQuery';
import { User } from '../../types/IUser';

export interface PendingSeller extends User {
  role: 'seller';
  sellerInfo: {
    nurseryName?: string;
    address?: string;
    phoneNumber?: string;
    businessLicense?: string;
    description?: string;
    registrationDate?: string;
    isApproved?: boolean;
  };
}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: appBaseQuery,
  tagTypes: ["PendingSellers"],
  endpoints: (builder) => ({
    getPendingSellers: builder.query<{ sellers: PendingSeller[] }, void>({
      query: () => "/admin/sellers/pending",
      providesTags: ["PendingSellers"],
    }),

    approveSeller: builder.mutation<{ message: string }, string>({
      query: (userId) => ({
        url: `/admin/sellers/${userId}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["PendingSellers"],
    }),
  }),
});

export const {
  useGetPendingSellersQuery,
  useApproveSellerMutation,
} = adminApi;
