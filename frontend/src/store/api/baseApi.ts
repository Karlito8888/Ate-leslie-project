import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseUrl = "http://localhost:5000"

// Type pour les tags
export type TagTypes = 'Profile'

// Type pour les erreurs d'API
export interface ApiError {
  status: number
  data: {
    message: string
  }
}

// Type pour la réponse de base de l'API
export interface ApiResponse<T> {
  status: 'success' | 'error'
  data: T
  token?: string
  message?: string
}

// Configuration de base de l'API
export const api = createApi({
  reducerPath: 'api',
  tagTypes: ['Profile'] as const,
  baseQuery: fetchBaseQuery({ 
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: () => ({}),
  keepUnusedDataFor: 5 * 60, // 5 minutes
})

// Export des hooks qui seront générés automatiquement
export const enhancedApi = api