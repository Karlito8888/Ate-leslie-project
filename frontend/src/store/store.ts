// Store configuration
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { baseApi } from './api/baseApi'
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'
import { authApi } from './api/authApi'
import { profileApi } from './api/profileApi'
import { adminApi } from './api/adminApi'
import { adminInternalMessageApi } from './api/adminInternalMessageApi'
import { contactApi } from './api/contactApi'
import { eventApi } from './api/eventApi'
import { reviewApi } from './api/reviewApi'
import { userApi } from './api/userApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      profileApi.middleware,
      adminApi.middleware,
      adminInternalMessageApi.middleware,
      contactApi.middleware,
      eventApi.middleware,
      reviewApi.middleware,
      userApi.middleware
    ),
})

// Enable listener behavior for the store
setupListeners(store.dispatch)

// Infer types from store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 