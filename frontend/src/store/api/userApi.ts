import { User, UserInfo } from '../../types/user';
import { api } from './baseApi';

export const userApi = api.injectEndpoints({
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
      providesTags: ['Profile'],
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
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} = userApi; 