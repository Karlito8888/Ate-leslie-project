import { createApi, fetchBaseQuery, EndpointBuilder, BaseQueryFn, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Types communs
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Tags communs
export type TagTypes = 
  | 'Auth'
  | 'Profile'
  | 'AdminUsers'
  | 'AdminMessages'
  | 'AdminStats'
  | 'Contact'
  | 'Events'
  | 'Reviews'

// Type pour le builder d'endpoints
export type BuilderType = EndpointBuilder<
  BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>,
  TagTypes,
  string
>

// Configuration de base pour toutes les APIs
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    'Auth',
    'Profile',
    'AdminUsers',
    'AdminMessages',
    'AdminStats',
    'Contact',
    'Events',
    'Reviews',
  ],
})

// Helper pour créer une API étendue
export const createExtendedApi = <T extends Record<string, any>>(
  config: {
    reducerPath: string
    endpoints: (builder: BuilderType) => T
  }
) => {
  return baseApi.injectEndpoints({
    endpoints: config.endpoints,
    overrideExisting: false,
  })
}