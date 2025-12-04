import { createApi } from "@reduxjs/toolkit/query/react";
import { Tree } from "../../types/ITree";
import { appBaseQuery } from './appBaseQuery';


export const treesApi = createApi({
  reducerPath: "treesApi",
  baseQuery: appBaseQuery,
  tagTypes: ["Trees"],
  keepUnusedDataFor: 300, // Cache for 5 minutes
  endpoints: (builder) => ({
    getTrees: builder.query<Tree[], void>({
      query: () => "/trees",
      providesTags: ["Trees"],
    }),
    createTree: builder.mutation<Tree, Partial<Tree>>({
      query: (treeData) => ({
        url: "/admin/trees",
        method: "POST",
        body: treeData,
      }),
      invalidatesTags: ["Trees"],
    }),
    updateTree: builder.mutation<Tree, { id: string; body: Partial<Tree> }>({
      query: ({ id, body }) => ({
        url: `/admin/trees/${id}`,
        method: "PATCH",
        body
      }),
      invalidatesTags: ["Trees"],
    }),
    deleteTree: builder.mutation<void, string>({
      query: (id) => ({
        url: `admin/trees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Trees"],
    }),
  }),
});

export const {
  useGetTreesQuery,
  useCreateTreeMutation,
  useUpdateTreeMutation,
  useDeleteTreeMutation,
} = treesApi;