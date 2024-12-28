import { BaseEntity, createExtendedApi } from './baseApi';

interface User extends BaseEntity {
  username: string;
  email: string;
  role: string;
  newsletterSubscribed: boolean;
}

interface UserUpdateRequest {
  username?: string;
  email?: string;
  newsletterSubscribed?: boolean;
}

export const userApi = createExtendedApi({
  reducerPath: 'userApi',
  endpoints: (builder) => ({
    getUser: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'AdminUsers', id }],
    }),
    updateUser: builder.mutation<User, { id: string; data: UserUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'AdminUsers', id }],
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateUserMutation,
} = userApi; 