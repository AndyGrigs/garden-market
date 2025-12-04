// src/store/api/categoryApi.ts - FIX für Image Upload
import { createApi } from '@reduxjs/toolkit/query/react';
import { Category, TranslatedString } from '../../types/ICategories'; 
import { appBaseQuery } from './appBaseQuery';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: appBaseQuery,
  tagTypes: ['Category'],
  keepUnusedDataFor: 300, // Cache for 5 minutes
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      providesTags: ['Category'],
      transformResponse: (response: Category[] | { categories: Category[] }) => {
        
        if (Array.isArray(response)) {
          return response;
        }
        
        if (
          response &&
          typeof response === 'object' &&
          Array.isArray((response as { categories: Category[] }).categories)
        ) {
          return (response as { categories: Category[] }).categories;
        }
        
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

     updateCategory: builder.mutation<Category, { 
      id: string; 
      name: TranslatedString;
      imageUrl?: string;
    }>({
      query: ({ id, name, imageUrl }) => {
       
        const body: { name: TranslatedString; imageUrl?: string } = { name };
        
        if (imageUrl !== undefined) {
          body.imageUrl = imageUrl;
        }
        
        return {
          url: `/categories/${id}`,
          method: 'PATCH',
          body
        };
      },
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