import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserInfo } from '../../types/user';
import { RootState } from '../store';

interface UserState {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
      state.error = null;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<UserInfo>>) => {
      if (state.profile) {
        state.profile = {
          ...state.profile,
          ...action.payload,
        };
      }
    },
    setUserError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearUserError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setUserProfile,
  updateUserProfile,
  setUserError,
  clearUserError,
} = userSlice.actions;

// Selectors
export const selectUserProfile = (state: RootState) => state.user.profile;
export const selectUserError = (state: RootState) => state.user.error;

export default userSlice.reducer; 