import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../../types/IUser";

// interface User {
//   id: string;
//   email: string;
//   fullName: string;
// }

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
  role: "user" | "admin";
  token: string;
}

// For demo purposes, we'll use a mock API
// const MOCK_DELAY = 1000;
// const MOCK_TOKEN = 'mock-jwt-token';

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4444",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (
        response: ApiResponse
      ): AuthResponse | Promise<AuthResponse> => {
        return {
          user: {
            id: response._id,
            email: response.email,
            fullName: response.fullName,
            role: response.role

          },
          token: response.token,
        };
      },
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: {
          email: data.email,
          fullName: data.fullName,
          password: data.password,
        },
      }),
      transformResponse: (response: ApiResponse) => {
        return {
          user: {
            id: response._id,
            email: response.email,
            fullName: response.fullName,
            role: response.role

          },
          token: response.token,
        };
      },
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetCurrentUserQuery, useLogoutMutation } =
  authApi;
