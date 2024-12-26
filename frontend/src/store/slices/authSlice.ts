import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

interface User {
  id: string
  username: string
  email: string
  role: string
  phoneNumber?: string
  fullName?: {
    firstName?: string
    fatherName?: string
    lastName?: string
    gender?: 'male' | 'female'
  }
  landlineNumber?: string
  mobileNumber?: string
  birthDate?: string
  address?: {
    unit?: string
    buildingName?: string
    streetNumber?: string
    streetName?: string
    poBox?: string
    district?: string
    city?: string
    emirate?: string
  }
  newsletterSubscribed?: boolean
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
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      localStorage.setItem('token', token)
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
  },
})

export const { setCredentials, setUser, clearAuth, logout } = authSlice.actions

export const selectCurrentUser = (state: RootState) => state.auth.user
export const selectCurrentToken = (state: RootState) => state.auth.token
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated

export default authSlice.reducer