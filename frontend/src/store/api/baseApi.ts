import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store'

export const baseUrl = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'

// API Types
export type TagTypes = 'Profile' | 'Users' | 'Events' | 'Reviews' | 'Messages' | 'Auth' | 'Contact'

export interface ApiError {
  status: number
  data: {
    message: string
  }
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

// Base API configuration
export const api = createApi({
  reducerPath: 'api',
  tagTypes: ['Profile', 'Users', 'Events', 'Reviews', 'Messages', 'Auth', 'Contact'] as const,
  baseQuery: fetchBaseQuery({ 
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Try to get token from Redux store first
      const token = (getState() as RootState).auth.token
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
    credentials: 'include', // Pour gérer les cookies
  }),
  endpoints: () => ({}),
  keepUnusedDataFor: 5 * 60, // 5 minutes
})

// Export des hooks qui seront générés automatiquement
export const enhancedApi = api