import { Types } from 'mongoose';
import { User } from '../models/User';
import { Event } from '../models/Event';
import { MSG } from './constants';

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  role: string;
  fullName?: {
    firstName?: string;
    fatherName?: string;
    lastName?: string;
    gender?: 'male' | 'female';
  };
  landlineNumber?: string;
  mobileNumber?: string;
  birthDate?: string;
  address?: {
    unit?: string;
    buildingName?: string;
    streetNumber?: string;
    streetName?: string;
    poBox?: string;
    district?: string;
    city?: string;
    emirate?: string;
  };
  newsletterSubscribed: boolean;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export const createApiError = (status: number, message: string): ApiError => {
  return new ApiError(status, message);
};

export const formatUserResponse = (user: any): UserResponse => ({
  id: user._id.toString(),
  username: user.username,
  email: user.email,
  role: user.role,
  fullName: user.fullName,
  landlineNumber: user.landlineNumber,
  mobileNumber: user.mobileNumber,
  birthDate: user.birthDate?.toISOString(),
  address: user.address,
  newsletterSubscribed: user.newsletterSubscribed
});

export const findUser = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw createApiError(404, MSG.no_user);
  }
  return user;
};

export const findEvent = async (id: string) => {
  const event = await Event.findById(id);
  if (!event) {
    throw createApiError(404, MSG.not_found);
  }
  return event;
};

export const checkEventOwnership = (event: { organizer: Types.ObjectId }, userId: string) => {
  if (event.organizer.toString() !== userId) {
    throw createApiError(403, MSG.no_access);
  }
}; 