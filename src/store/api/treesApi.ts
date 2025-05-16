import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Tree } from "../../types/ITree";


export const treesApi = createApi({
  reducerPath: "treesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4444",
    credentials: "include",
  }),
  tagTypes: ["Trees"],
  endpoints: (builder) => ({
    getTrees: builder.query<Tree[], void>({
      query: () => "/trees",
      providesTags: ["Trees"],
    }),
    createTree: builder.mutation<Tree, Partial<Tree>>({
      query: (treeData) => ({
        url: "/trees",
        method: "POST",
        body: treeData,
      }),
      invalidatesTags: ["Trees"],
    }),
    updateTree: builder.mutation<Tree, { id: string; data: Partial<Tree> }>({
      query: ({ id, ...treeData }) => ({
        url: `/trees/${id}`,
        method: "PATCH",
        body: treeData,
      }),
      invalidatesTags: ["Trees"],
    }),
    deleteTree: builder.mutation<void, string>({
      query: (id) => ({
        url: `/trees/${id}`,
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