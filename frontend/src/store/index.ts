import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { api } from './api/baseApi'
import { userApi } from './api/userApi'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [userApi.reducerPath]: userApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, userApi.middleware),
})

setupListeners(store.dispatch)

// Types d'inférence
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 