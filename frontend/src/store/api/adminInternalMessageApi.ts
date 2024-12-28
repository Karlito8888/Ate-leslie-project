import { BaseEntity, createExtendedApi } from './baseApi';

interface Message extends BaseEntity {
  from: string;
  to: string;
  subject: string;
  content: string;
  read: boolean;
}

export const adminInternalMessageApi = createExtendedApi({
  reducerPath: 'adminInternalMessageApi',
  endpoints: (builder) => ({
    getInbox: builder.query<Message[], void>({
      query: () => '/admin-messages/inbox',
      providesTags: ['AdminMessages'],
    }),
    getSent: builder.query<Message[], void>({
      query: () => '/admin-messages/sent',
      providesTags: ['AdminMessages'],
    }),
    sendMessage: builder.mutation<Message, { to: string; subject: string; content: string }>({
      query: (messageData) => ({
        url: '/admin-messages',
        method: 'POST',
        body: messageData,
      }),
      invalidatesTags: ['AdminMessages'],
    }),
    markAsRead: builder.mutation<void, string>({
      query: (messageId) => ({
        url: `/admin-messages/${messageId}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['AdminMessages'],
    }),
  }),
});

export const {
  useGetInboxQuery,
  useGetSentQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
} = adminInternalMessageApi; 