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
  isVerified?: boolean;
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
        // Store token in cookies for persistence
        const token = response.token;
        if (token) {
          document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
        }
        
        return {
          user: {
            id: response._id,
            email: response.email,
            fullName: response.fullName,
            role: response.role,
            language: response.language,
            isVerified: response.isVerified
          },
          token: response.token,
        };
      },
    }),

    register: builder.mutation<{ message: string; requiresVerification: boolean }, RegisterRequest>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: {
          email: data.email,
          fullName: data.fullName,
          password: data.password,
          language: data.language || 'en',
        },
      }),
    }),

    getCurrentUser: builder.query<User, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse) => ({
        id: response._id,
        email: response.email,
        fullName: response.fullName,
        role: response.role,
        language: response.language,
        isVerified: response.isVerified
      }),
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    verifyEmail: builder.mutation<{message: string}, {email: string; code: string}>({
      query: (body) => ({
        url: "/auth/verify-email",
        method: "POST",
        body,
      })
    }),

    resendVerificationCode: builder.mutation<{message: string}, {email: string}>({
      query: (body) => ({
        url: "/auth/resend-verification-code", 
        method: "POST",
        body,
      })
    }),

    forgotPassword: builder.mutation<{message: string}, {email: string}>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      })
    }),

    resetPassword: builder.mutation<{message: string}, {token: string; password: string}>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      })
    })
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useGetCurrentUserQuery, 
  useLogoutMutation, 
  useVerifyEmailMutation,
  useResendVerificationCodeMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = authApi;