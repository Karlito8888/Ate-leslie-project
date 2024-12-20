export interface Address {
  unit?: string;
  buildingName?: string;
  streetNumber?: string;
  streetName?: string;
  poBox?: string;
  district?: string;
  city?: string;
  emirate?: string;
}

export interface FullName {
  firstName?: string;
  fatherName?: string;
  lastName?: string;
  gender?: 'male' | 'female';
}

export interface UserInfo {
  username?: string;
  email?: string;
  fullName?: FullName;
  landlineNumber?: string;
  mobileNumber?: string;
  birthDate?: string;
  newsletter?: boolean;
  address?: Address;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  fullName?: FullName;
  role: 'user' | 'admin';
  landlineNumber?: string;
  mobileNumber?: string;
  birthDate?: string;
  address?: Address;
  newsletterSubscribed: boolean;
  createdAt: string;
  updatedAt: string;
} 