
import { createApi} from '@reduxjs/toolkit/query/react';
import { Category, TranslatedString } from '../../types/ICategories'; 
import { appBaseQuery } from './appBaseQuery';


export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: appBaseQuery,
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      providesTags: ['Category']
    }),
        
    createCategory: builder.mutation<Category, { name: TranslatedString }>({
      query: (body) => ({
        url: '/categories',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Category']
    }),

    updateCategory: builder.mutation<Category, { id: string; name: TranslatedString }>({
        query: ({ id, name }) => ({
          url: `/categories/${id}`,
          method: 'PATCH',
          body: { name }
        }),
        invalidatesTags: ['Category']
      }),
      
    deleteCategory: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Category']
    })
  })
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} = categoryApi;
