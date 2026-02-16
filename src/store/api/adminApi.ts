import { createApi } from '@reduxjs/toolkit/query/react';
import { appBaseQuery } from './appBaseQuery';
import { User } from '../../types/IUser';
import {
  Notification,
  NotificationsResponse,
  UnreadCountResponse,
  CreateNotificationRequest,
} from '../../types/INotification';
import { PendingTree } from '@/types/IPendingTree';

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
  reducerPath: 'adminApi',
  baseQuery: appBaseQuery,
  tagTypes: ['PendingSellers', 'Notifications', 'UnreadCount', 'PendingTrees'],
  keepUnusedDataFor: 120, // Cache for 2 minutes (admin data changes frequently)
  endpoints: (builder) => ({
    // Seller endpoints
    getPendingSellers: builder.query<{ sellers: PendingSeller[] }, void>({
      query: () => '/admin/sellers/pending',
      providesTags: ['PendingSellers'],
    }),

    approveSeller: builder.mutation<{ message: string }, string>({
      query: (userId) => ({
        url: `/admin/sellers/${userId}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: ['PendingSellers'],
    }),

    rejectSeller: builder.mutation<
      { message: string },
      { userId: string; reason?: string }
    >({
      query: ({ userId, reason }) => ({
        url: `/admin/sellers/${userId}/reject`,
        method: 'DELETE',
        body: reason ? { reason } : undefined,
      }),
      invalidatesTags: ['PendingSellers'],
    }),

    getPendingTrees: builder.query<{ trees: PendingTree[] }, void>({
      query: () => '/admin/trees/pending',
      providesTags: ['PendingTrees',],
    }),

    approveTree: builder.mutation<
      { message: string; tree: PendingTree },
      string
    >({
      query: (treeId) => ({
        url: `/admin/trees/${treeId}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: ['PendingTrees'],
    }),

    updateTreeTranslations: builder.mutation<
      PendingTree,
      { id: string; body: { title: { ro: string }; description: { ro: string } } }
    >({
      query: ({ id, body }) => ({
        url: `/admin/trees/${id}/translations`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['PendingTrees'],
    }),

    // Notification endpoints
    getNotifications: builder.query<
      NotificationsResponse,
      { page?: number; limit?: number } | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit)
          searchParams.append('limit', params.limit.toString());
        const queryString = searchParams.toString();
        return `/admin/notifications${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Notifications'],
    }),

    getUnreadCount: builder.query<UnreadCountResponse, void>({
      query: () => '/admin/notifications/unread-count',
      providesTags: ['UnreadCount'],
    }),

    createNotification: builder.mutation<
      { notification: Notification },
      CreateNotificationRequest
    >({
      query: (body) => ({
        url: '/admin/notifications',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Notifications', 'UnreadCount'],
    }),

    markAsRead: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications', 'UnreadCount'],
    }),

    markAllAsRead: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/admin/notifications/mark-all-read',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications', 'UnreadCount'],
    }),

    deleteNotification: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications', 'UnreadCount'],
    }),
  }),
});

export const {
  useGetPendingSellersQuery,
  useApproveSellerMutation,
  useRejectSellerMutation,
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useCreateNotificationMutation,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useApproveTreeMutation,
  useGetPendingTreesQuery,
  useUpdateTreeTranslationsMutation,
} = adminApi;
