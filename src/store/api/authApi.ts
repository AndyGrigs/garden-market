import { createApi } from "@reduxjs/toolkit/query/react";
import { User } from "../../types/IUser";
import { appBaseQuery } from './appBaseQuery';


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
  language?: string;
}

interface ApiResponse {
  _id: string;
  email: string;
  fullName: string;
  role: "user" | "admin";
  language?: string;
  token: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: appBaseQuery,
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
            role: response.role,
            language: response.language

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
          language: data.language || 'ru'
        },
      }),
      transformResponse: (response: ApiResponse) => {
        return {
          user: {
            id: response._id,
            email: response.email,
            fullName: response.fullName,
            role: response.role,
            language: response.language
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
    verifyEmail: builder.mutation<{message: string}, {token: string}>({
      query: (body) => ({
        url: "/auth/verify-email",
        method: "POST",
        body,
      })
    })
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetCurrentUserQuery, useLogoutMutation, useVerifyEmailMutation } =
  authApi;
