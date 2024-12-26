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

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  assignedTo?: string;
  status: 'new' | 'assigned' | 'in_progress' | 'resolved';
}

interface MessagesResponse {
  messages: Message[];
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

    getMessages: builder.query<ApiResponse<MessagesResponse>, void>({
      query: () => ({
        url: '/api/admin/messages',
        method: 'GET',
      }),
      providesTags: ['Messages'],
    }),

    assignMessage: builder.mutation<void, { messageId: string, adminId: string }>({
      query: ({ messageId, adminId }) => ({
        url: `/api/admin/messages/${messageId}/assign`,
        method: 'POST',
        body: { adminId },
      }),
      invalidatesTags: ['Messages'],
    }),

    updateMessageStatus: builder.mutation<void, { messageId: string, status: Message['status'] }>({
      query: ({ messageId, status }) => ({
        url: `/api/admin/messages/${messageId}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Messages'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useGetMessagesQuery,
  useAssignMessageMutation,
  useUpdateMessageStatusMutation,
} = adminApi; 