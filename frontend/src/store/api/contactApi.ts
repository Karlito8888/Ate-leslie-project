import { BaseEntity, createExtendedApi } from './baseApi';

interface ContactMessage extends BaseEntity {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
}

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactApi = createExtendedApi({
  reducerPath: 'contactApi',
  endpoints: (builder) => ({
    sendMessage: builder.mutation<void, ContactRequest>({
      query: (messageData) => ({
        url: '/contact',
        method: 'POST',
        body: messageData,
      }),
    }),
    getMessages: builder.query<ContactMessage[], void>({
      query: () => '/contact',
      providesTags: ['Contact'],
    }),
    updateMessage: builder.mutation<void, { id: string; status: ContactMessage['status'] }>({
      query: ({ id, status }) => ({
        url: `/contact/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Contact'],
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetMessagesQuery,
  useUpdateMessageMutation,
} = contactApi; 