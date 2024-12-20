import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User, UserInfo } from '../../types/user';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api',
    credentials: 'include',
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUserProfile: builder.query<User, string>({
      query: (userId) => `/users/${userId}`,
      transformResponse: (response: User) => {
        // Format the date from YYYY-MM-DD to DD/MM/YYYY if it exists
        if (response.birthDate) {
          const date = new Date(response.birthDate);
          return {
            ...response,
            birthDate: `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
          };
        }
        return response;
      },
      providesTags: ['User'],
    }),
    updateUserProfile: builder.mutation<User, { userId: string; userData: UserInfo }>({
      query: ({ userId, userData }) => ({
        url: `/users/${userId}`,
        method: 'PUT',
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