import { BaseEntity, createExtendedApi } from './baseApi';

export type MessageStatus = 'new' | 'assigned' | 'in_progress' | 'resolved';

export interface User extends BaseEntity {
  username: string;
  email: string;
  role: string;
  newsletterSubscribed: boolean;
}

export interface Message extends BaseEntity {
  name: string;
  email: string;
  subject: string;
  content: string;
  status: MessageStatus;
  assignedTo?: string;
}

export interface Stats {
  totalUsers: number;
  newUsers: number;
  totalMessages: number;
  unreadMessages: number;
}

export interface Admin extends User {
  role: 'admin';
}

export interface AdminMessage extends BaseEntity {
  from: {
    id: string;
    username: string;
  };
  to: {
    id: string;
    username: string;
  };
  subject: string;
  content: string;
  isRead: boolean;
}

export const adminApi = createExtendedApi({
  reducerPath: 'adminApi',
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/admin/users',
      providesTags: ['AdminUsers'],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminUsers'],
    }),
    getMessages: builder.query<Message[], void>({
      query: () => '/admin/messages',
      providesTags: ['AdminMessages'],
    }),
    assignMessage: builder.mutation<void, { messageId: string; adminId: string }>({
      query: ({ messageId, adminId }) => ({
        url: `/admin/messages/${messageId}/assign`,
        method: 'PATCH',
        body: { adminId },
      }),
      invalidatesTags: ['AdminMessages'],
    }),
    updateMessageStatus: builder.mutation<void, { messageId: string; status: Message['status'] }>({
      query: ({ messageId, status }) => ({
        url: `/admin/messages/${messageId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['AdminMessages'],
    }),
    replyToMessage: builder.mutation<void, { messageId: string; content: string }>({
      query: ({ messageId, content }) => ({
        url: `/admin/messages/${messageId}/reply`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: ['AdminMessages'],
    }),
    getStats: builder.query<Stats, void>({
      query: () => '/admin/stats',
      providesTags: ['AdminStats'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetMessagesQuery,
  useAssignMessageMutation,
  useUpdateMessageStatusMutation,
  useReplyToMessageMutation,
  useGetStatsQuery,
} = adminApi; 