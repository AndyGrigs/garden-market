// store/api/uploadApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { appBaseQuery } from './appBaseQuery';

export const uploadApi = createApi({
  reducerPath: "uploadApi",
  baseQuery: appBaseQuery,
  endpoints: (builder) => ({
    uploadImage: builder.mutation<{ imageUrl: string }, FormData>({
      query: (formData) => ({
        url: "/upload",
        method: "POST",
        body: formData,
      }),
    }),

    deleteImage: builder.mutation<{ message: string }, string>({
      query: (filename) => ({
        url: `/delete-image/${filename}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useUploadImageMutation, useDeleteImageMutation } = uploadApi;
