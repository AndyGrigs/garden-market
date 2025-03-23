import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface User {
  id: string;
  email: string;
  name: string;
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
  name: string;
}

// For demo purposes, we'll use a mock API
const MOCK_DELAY = 1000;
const MOCK_TOKEN = 'mock-jwt-token';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      queryFn: async ({ email, password }) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
        
        // Mock validation
        if (email === 'test@example.com' && password === 'password') {
          return {
            data: {
              user: {
                id: '1',
                email,
                name: 'Test User',
              },
              token: MOCK_TOKEN,
            },
          };
        }
        
        return {
          error: {
            status: 401,
            data: { message: 'Invalid credentials' },
          },
        };
      },
    }),
    
    register: builder.mutation<AuthResponse, RegisterRequest>({
      queryFn: async ({ email, password, name }) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
        
        return {
          data: {
            user: {
              id: '1',
              email,
              name,
            },
            token: MOCK_TOKEN,
          },
        };
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;