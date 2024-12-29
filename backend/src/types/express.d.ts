import { Request } from 'express';
import { Types } from 'mongoose';

export interface RequestUser {
  _id: Types.ObjectId;
  id: string;
  role: 'user' | 'admin';
  username: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
} 