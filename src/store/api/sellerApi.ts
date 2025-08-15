import { createApi } from "@reduxjs/toolkit/query/react";

import { appBaseQuery } from './appBaseQuery';
import { Tree, TreeApiData } from '../../types/ITree';

export const sellerApi = createApi({
  reducerPath: "sellerApi",
  baseQuery: appBaseQuery,
  tagTypes: ["SellerTree"],
  endpoints: (builder) => ({
    // Отримати товари продавця
    getSellerTrees: builder.query<{ trees: Tree[] }, void>({
      query: () => "/seller/trees",
      providesTags: ["SellerTree"],
    }),
    
    // Створити товар

    createSellerTree: builder.mutation<Tree, TreeApiData>({
        query: (tree) => ({
        url: "/seller/trees",
        method: "POST",
        body: tree,
  }),
  invalidatesTags: ["SellerTree"],
}),

    
    // Оновити товар
  // Оновити товар  
updateSellerTree: builder.mutation<Tree, { id: string; data: TreeApiData }>({
  query: ({ id, data }) => ({
    url: `/seller/trees/${id}`,
    method: "PATCH",
    body: data,
  }),
  invalidatesTags: ["SellerTree"],
}),
    
    // Видалити товар
    deleteSellerTree: builder.mutation<void, string>({
      query: (id) => ({
        url: `/seller/trees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SellerTree"],
    }),
  }),
});

export const {
  useGetSellerTreesQuery,
  useCreateSellerTreeMutation,
  useUpdateSellerTreeMutation,
  useDeleteSellerTreeMutation,
} = sellerApi;