import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store'

export const baseUrl = import.meta.env.PROD ? '/api' : 'http://localhost:5000'

// API Types
export type TagTypes = 'Profile' | 'Users' | 'AdminStats' | 'Messages' | 'Auth'

export interface ApiError {
  status: number
  data: {
    message: string
  }
}

export interface ApiResponse<T> {
  status: 'success' | 'error'
  data: T
  token?: string
  message?: string
}

// Base API configuration
export const api = createApi({
  reducerPath: 'api',
  tagTypes: ['Profile', 'Users', 'AdminStats', 'Messages', 'Auth'] as const,
  baseQuery: fetchBaseQuery({ 
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Try to get token from Redux store first
      const token = (getState() as RootState).auth.token
      // Fallback to localStorage if not in store
      const localToken = !token ? localStorage.getItem('token') : token
      
      if (localToken) {
        headers.set('authorization', `Bearer ${localToken}`)
      }
      return headers
    },
  }),
  endpoints: () => ({}),
  keepUnusedDataFor: 5 * 60, // 5 minutes
})

// Export des hooks qui seront générés automatiquement
export const enhancedApi = api