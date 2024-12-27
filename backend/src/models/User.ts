// backend/src/models/User.ts

import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  role: string;
  newsletterSubscribed: boolean;
  mobileNumber?: string;
  landlineNumber?: string;
  resetToken?: string;
  resetExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  newsletterSubscribed: {
    type: Boolean,
    default: true
  },
  mobileNumber: {
    type: String,
    trim: true,
    default: null
  },
  landlineNumber: {
    type: String,
    trim: true,
    default: null
  },
  resetToken: String,
  resetExpires: Date
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>('User', userSchema);
