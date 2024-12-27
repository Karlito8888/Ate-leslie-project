import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: Types.ObjectId;
        id: string;
        role: string;
        username?: string;
        email?: string;
      };
    }
  }
}

export interface AuthRequest extends Request {
  user: {
    _id: Types.ObjectId;
    id: string;
    role: string;
    username?: string;
    email?: string;
  };
}

export type AuthHandler = RequestHandler<any, any, any, any>;

export {}; 