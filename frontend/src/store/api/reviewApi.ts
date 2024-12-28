import { BaseEntity, createExtendedApi } from './baseApi';

interface Review extends BaseEntity {
  eventId: string;
  userId: string;
  rating: number;
  comment: string;
}

interface ReviewRequest {
  rating: number;
  comment: string;
}

export const reviewApi = createExtendedApi({
  reducerPath: 'reviewApi',
  endpoints: (builder) => ({
    getEventReviews: builder.query<Review[], string>({
      query: (eventId) => `/events/${eventId}/reviews`,
      providesTags: (result, error, eventId) => [{ type: 'Reviews', id: eventId }],
    }),
    addReview: builder.mutation<Review, { eventId: string; review: ReviewRequest }>({
      query: ({ eventId, review }) => ({
        url: `/events/${eventId}/reviews`,
        method: 'POST',
        body: review,
      }),
      invalidatesTags: (result, error, { eventId }) => [{ type: 'Reviews', id: eventId }],
    }),
  }),
});

export const {
  useGetEventReviewsQuery,
  useAddReviewMutation,
} = reviewApi; 