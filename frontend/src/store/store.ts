import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import { userApi } from './api/userApi';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['userApi/executeMutation/fulfilled'],
      },
    }).concat(userApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
import { setupListeners } from '@reduxjs/toolkit/query';
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store }; 