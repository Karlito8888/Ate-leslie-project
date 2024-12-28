import { BaseEntity, createExtendedApi } from './baseApi';

interface User extends BaseEntity {
  username: string;
  email: string;
  role: string;
  newsletterSubscribed: boolean;
  mobileNumber?: string;
  landlineNumber?: string;
}

interface ProfileUpdateData {
  username?: string;
  email?: string;
  newsletterSubscribed?: boolean;
  mobileNumber?: string;
  landlineNumber?: string;
}

interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const profileApi = createExtendedApi({
  reducerPath: 'profileApi',
  endpoints: (builder) => ({
    getProfile: builder.query<User, void>({
      query: () => '/profile',
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<User, ProfileUpdateData>({
      query: (profileData) => ({
        url: '/profile',
        method: 'PATCH',
        body: profileData,
      }),
      invalidatesTags: ['Profile'],
    }),
    changePassword: builder.mutation<void, PasswordChangeRequest>({
      query: (passwordData) => ({
        url: '/profile/change-password',
        method: 'POST',
        body: passwordData,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = profileApi; 