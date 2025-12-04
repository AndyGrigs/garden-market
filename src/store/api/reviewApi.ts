import { createApi } from "@reduxjs/toolkit/query/react";
import { Review, ReviewFormData } from '../../types/IReviews';
import { appBaseQuery } from './appBaseQuery';

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: appBaseQuery,
  tagTypes: ["Review"],
  keepUnusedDataFor: 300, // Cache for 5 minutes
  endpoints: (builder) => ({
    getReviews: builder.query<Review[], void>({
      query: () => "/api/reviews",
      providesTags: ["Review"],
    }),
    createReview: builder.mutation<Review,  Partial<ReviewFormData>>({
      query: (reviewData) => ({
        url: "/api/reviews",
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: ["Review"],
    }),
    getUserReviews: builder.query<Review[], string>({
      query: (userId) => `/api/reviews/user/${userId}`,
      providesTags: ["Review"],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useCreateReviewMutation,
  useGetUserReviewsQuery,
} = reviewApi;