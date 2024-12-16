import { createSlice } from '@reduxjs/toolkit'
import { authApi } from '../api/authApi'
import { RootState } from '../store'

interface User {
  id: string
  username: string
  email: string
  role: string
  phoneNumber?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    builder
      // Après une connexion réussie
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          if (payload.data) {
            state.token = payload.data.token
            state.user = payload.data.user
            state.isAuthenticated = true
            localStorage.setItem('token', payload.data.token)
          }
        }
      )
      // Après avoir obtenu le profil
      .addMatcher(
        authApi.endpoints.getProfile.matchFulfilled,
        (state, { payload }) => {
          if (payload.data) {
            state.user = payload.data
          }
        }
      )
      // Après une déconnexion réussie
      .addMatcher(
        authApi.endpoints.logout.matchFulfilled,
        (state) => {
          state.user = null
          state.token = null
          state.isAuthenticated = false
          localStorage.removeItem('token')
        }
      )
  },
})

export const { clearAuth } = authSlice.actions
export default authSlice.reducer

// Sélecteurs typés
export const selectCurrentUser = (state: RootState): User | null => state.auth.user
export const selectIsAuthenticated = (state: RootState): boolean => state.auth.isAuthenticated
export const selectToken = (state: RootState): string | null => state.auth.token 