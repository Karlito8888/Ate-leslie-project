import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User, UserInfo } from '../../types/user';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api',
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUserProfile: builder.query<User, void>({
      query: () => ({
        url: '/auth/profile',
        method: 'GET'
      }),
      transformResponse: (response: { data: { user: User } }) => {
        const user = response.data.user;
        if (user.birthDate) {
          const date = new Date(user.birthDate);
          return {
            ...user,
            birthDate: `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
          };
        }
        return user;
      },
      providesTags: ['User'],
    }),
    updateUserProfile: builder.mutation<User, UserInfo>({
      query: (userData) => ({
        url: '/auth/profile',
        method: 'PATCH',
        body: {
          ...userData,
          birthDate: userData.birthDate ? new Date(userData.birthDate.split('/').reverse().join('-')) : undefined
        },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} = userApi; 