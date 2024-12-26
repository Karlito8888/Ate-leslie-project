import { api } from './baseApi';
import { ApiResponse } from './baseApi';

interface DashboardStats {
  stats: {
    totalUsers: number;
    totalAdmins: number;
  };
}

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UsersResponse {
  users: User[];
}

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<ApiResponse<DashboardStats>, void>({
      query: () => ({
        url: '/api/admin/dashboard',
        method: 'GET',
      }),
      providesTags: ['AdminStats'],
    }),

    getAllUsers: builder.query<ApiResponse<UsersResponse>, void>({
      query: () => ({
        url: '/api/admin/users',
        method: 'GET',
      }),
      providesTags: ['Users'],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (userId: string) => ({
        url: `/api/admin/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users', 'AdminStats'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetAllUsersQuery,
  useDeleteUserMutation,
} = adminApi; 