import { BaseEntity, createExtendedApi } from './baseApi';

interface Event extends BaseEntity {
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  capacity: number;
  price: number;
  category: string;
  createdBy: string;
}

interface EventRequest {
  title: string;
  description: string;
  date: string;
  location: string;
  image?: File;
  capacity: number;
  price: number;
  category: string;
}

export const eventApi = createExtendedApi({
  reducerPath: 'eventApi',
  endpoints: (builder) => ({
    getEvents: builder.query<Event[], void>({
      query: () => '/events',
      providesTags: ['Events'],
    }),
    getEvent: builder.query<Event, string>({
      query: (id) => `/events/${id}`,
      providesTags: ['Events'],
    }),
    createEvent: builder.mutation<Event, FormData>({
      query: (eventData) => ({
        url: '/events',
        method: 'POST',
        body: eventData,
      }),
      invalidatesTags: ['Events'],
    }),
    updateEvent: builder.mutation<Event, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/events/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Events'],
    }),
    deleteEvent: builder.mutation<void, string>({
      query: (id) => ({
        url: `/events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Events'],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApi; 