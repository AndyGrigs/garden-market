import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Tree } from '../../types';
import { trees as mockTrees } from '../../data/trees';

const MOCK_DELAY = 800;

export const treesApi = createApi({
  reducerPath: 'treesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Trees'],
  endpoints: (builder) => ({
    getTrees: builder.query<Tree[], void>({
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
        return { data: mockTrees };
      },
      providesTags: ['Trees'],
    }),
  }),
});

export const { useGetTreesQuery } = treesApi;