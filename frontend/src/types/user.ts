export interface Address {
  unit?: string;
  buildingName?: string;
  streetNumber: string;
  streetName: string;
  poBox?: string;
  district: string;
  city: string;
  emirate: string;
}

export interface UserInfo {
  landlineNumber: string;
  mobileNumber: string;
  birthDate: string;
  newsletter: boolean;
  address: Address;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  landlineNumber?: string;
  mobileNumber?: string;
  birthDate?: string;
  address?: Address;
  newsletterSubscribed: boolean;
  createdAt: string;
  updatedAt: string;
} 