import { api } from './baseApi.ts'
import type { TagTypes, ApiResponse } from './baseApi.ts'
import type { EndpointBuilder } from '@reduxjs/toolkit/query/react'
import type { FetchBaseQueryMeta, FetchBaseQueryError, FetchArgs } from '@reduxjs/toolkit/query'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'

type UserRole = "user" | "admin";

interface UserData {
  username: string
  email: string
  password: string
  mobileNumber?: string
  landlineNumber?: string
  newsletterSubscribed?: boolean
}

interface Credentials {
  email: string
  password: string
}

interface ProfileData {
  username?: string
  email?: string
  mobileNumber?: string
  landlineNumber?: string
  newsletterSubscribed?: boolean
}

interface PasswordReset {
  token: string
  password: string
}

interface PasswordChange {
  currentPassword: string
  newPassword: string
}

interface User {
  id: string
  username: string
  email: string
  role: UserRole
  mobileNumber?: string
  landlineNumber?: string
  newsletterSubscribed: boolean
}

interface LoginResponse {
  token: string
  user: User
}

type BuilderType = EndpointBuilder<
  BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>,
  TagTypes,
  typeof api.reducerPath
>

export const authApi = api.injectEndpoints({
  endpoints: (builder: BuilderType) => ({
    // Authentification
    register: builder.mutation<ApiResponse<void>, UserData>({
      query: (userData: UserData) => ({
        url: '/api/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    
    login: builder.mutation<ApiResponse<LoginResponse>, Credentials>({
      query: (credentials: Credentials) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Obtenir le profil
    getProfile: builder.query<ApiResponse<UserData>, void>({
      query: () => 'api/auth/profile',
      providesTags: ['Profile'],
    }),

    // Mettre à jour le profil
    updateProfile: builder.mutation<ApiResponse<UserData>, ProfileData>({
      query: (profileData: ProfileData) => ({
        url: 'api/auth/profile',
        method: 'PATCH',
        body: profileData,
      }),
      invalidatesTags: ['Profile'],
    }),

    // Mot de passe oublié
    forgotPassword: builder.mutation<ApiResponse<void>, string>({
      query: (email: string) => ({
        url: 'api/auth/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),

    // Réinitialisation du mot de passe
    resetPassword: builder.mutation<ApiResponse<void>, PasswordReset>({
      query: ({ token, password }: PasswordReset) => ({
        url: `api/auth/reset-password/${token}`,
        method: 'POST',
        body: { password },
      }),
    }),

    // Changement de mot de passe
    changePassword: builder.mutation<ApiResponse<void>, PasswordChange>({
      query: (passwordData: PasswordChange) => ({
        url: 'api/auth/change-password',
        method: 'PATCH',
        body: passwordData,
      }),
    }),

    // Toggle newsletter
    toggleNewsletter: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: 'api/auth/profile/newsletter',
        method: 'PATCH',
      }),
      invalidatesTags: ['Profile'],
    }),

    // Déconnexion
    logout: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: 'api/auth/logout',
        method: 'POST',
      }),
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
  useToggleNewsletterMutation,
  useLogoutMutation,
} = authApi 