import { api } from './baseApi'
import type { TagTypes, ApiResponse } from './baseApi'
import type { EndpointBuilder } from '@reduxjs/toolkit/query/react'
import type { FetchBaseQueryMeta, FetchBaseQueryError, FetchArgs } from '@reduxjs/toolkit/query'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'

type UserRole = 'user' | 'admin'

interface UserData {
  username: string
  email: string
  password: string
  role?: UserRole
  newsletterSubscribed?: boolean
  mobileNumber?: string
  landlineNumber?: string
}

interface Credentials {
  email: string
  password: string
}

interface User {
  id: string
  username: string
  email: string
  role: UserRole
  newsletterSubscribed: boolean
  mobileNumber?: string
  landlineNumber?: string
  createdAt: string
  updatedAt: string
}

interface LoginResponse {
  user: User
  token: string
}

interface ProfileUpdateData {
  username?: string
  email?: string
  newsletterSubscribed?: boolean
  mobileNumber?: string
  landlineNumber?: string
}

type BuilderType = EndpointBuilder<
  BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>,
  TagTypes,
  typeof api.reducerPath
>

export const authApi = api.injectEndpoints({
  endpoints: (builder: BuilderType) => ({
    // Authentification
    register: builder.mutation<ApiResponse<LoginResponse>, UserData>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),
    
    login: builder.mutation<ApiResponse<LoginResponse>, Credentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Mot de passe oublié
    forgotPassword: builder.mutation<ApiResponse<void>, string>({
      query: (email) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),

    // Réinitialisation du mot de passe
    resetPassword: builder.mutation<ApiResponse<void>, { token: string; password: string }>({
      query: ({ token, password }) => ({
        url: `/auth/reset-password/${token}`,
        method: 'POST',
        body: { password },
      }),
    }),

    // Changement de mot de passe
    changePassword: builder.mutation<ApiResponse<void>, { currentPassword: string; newPassword: string }>({
      query: (passwordData) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: passwordData,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Déconnexion
    logout: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),

    // Obtenir le profil
    getProfile: builder.query<ApiResponse<User>, void>({
      query: () => ({
        url: '/profile',
        method: 'GET',
      }),
      providesTags: ['Auth', 'Profile'],
    }),

    // Mettre à jour le profil
    updateProfile: builder.mutation<ApiResponse<User>, ProfileUpdateData>({
      query: (profileData) => ({
        url: '/profile',
        method: 'PATCH',
        body: profileData,
      }),
      invalidatesTags: ['Auth', 'Profile'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useLogoutMutation,
} = authApi 