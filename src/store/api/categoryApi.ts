
import { createApi } from '@reduxjs/toolkit/query/react';
import { Category, TranslatedString } from '../../types/ICategories'; 
import { appBaseQuery } from './appBaseQuery';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: appBaseQuery,
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      providesTags: ['Category'],
      // ДОДАНО: Обробка відповіді з бекенду
      transformResponse: (response: Category[] | { categories: Category[] }) => {
        console.log('Categories API raw response:', response);
        
        // Якщо бекенд відправляє прямо масив
        if (Array.isArray(response)) {
          console.log('Categories: direct array format');
          return response;
        }
        
        // Якщо бекенд відправляє об'єкт з categories всередині
        if (
          response &&
          typeof response === 'object' &&
          Array.isArray((response as { categories: Category[] }).categories)
        ) {
          console.log('Categories: wrapped in object format');
          return (response as { categories: Category[] }).categories;
        }
        
        // Якщо щось незрозуміле
        console.warn('Unexpected categories response format:', response);
        return [];
      },
      transformErrorResponse: (response: unknown) => {
        console.error('Categories API Error:', response);
        if (
          response &&
          typeof response === 'object' &&
          'status' in response &&
          'data' in response
        ) {
          const err = response as { status: number; data?: unknown };
          return {
            status: err.status,
            data: err.data || { message: 'Failed to fetch categories' }
          };
        }
        return {
          status: 500,
          data: { message: 'Failed to fetch categories' }
        };
      },
    }),
        
    createCategory: builder.mutation<Category, Partial<Category>>({
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