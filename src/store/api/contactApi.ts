import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IContactForm } from '@/types/IContactForm';

// Define the contact API slice
export const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL || '/api'}`,
  }),
  tagTypes: ['Contact'],
  endpoints: (builder) => ({
    // Mutation to send contact form data
    sendContactMessage: builder.mutation<void, IContactForm>({
      query: (contactData) => ({
        url: '/contact',
        method: 'POST',
        body: contactData,
      }),
      invalidatesTags: ['Contact'],
    }),
  }),
});

export const { useSendContactMessageMutation } = contactApi;