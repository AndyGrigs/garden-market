import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest extends LoginRequest {
  fullName: string;
}

interface ApiResponse {
  _id: string;
  email: string;
  fullName: string;
  token: string;
}

// For demo purposes, we'll use a mock API
// const MOCK_DELAY = 1000;
// const MOCK_TOKEN = 'mock-jwt-token';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4444' }),
  endpoints: (builder) => ({

    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',       
        method: 'POST',
        body: credentials,    
      }),
      transformResponse: (response: ApiResponse): AuthResponse | Promise<AuthResponse> =>  {
        return {
          user: {
            id: response._id,
            email: response.email,
            fullName: response.fullName,
          },
          token: response.token,
        };
      },
    }),
    
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: {
          email: data.email,
          fullName: data.fullName,
          password: data.password
        },
      }),
      transformResponse: (response: ApiResponse) => {
        return {
          user: {
            id: response._id,
            email: response.email,
            fullName: response.fullName,
          },
          token: response.token
        }
      }
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;