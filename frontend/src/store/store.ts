// Store configuration
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { api } from './api/baseApi'
import { userApi } from './api/userApi'
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [userApi.reducerPath]: userApi.reducer,
    auth: authReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, userApi.middleware),
})

// Enable listener behavior for the store
setupListeners(store.dispatch)

// Infer types from store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 