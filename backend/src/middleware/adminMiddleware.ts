import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    throw new ApiError('Admin access required', 403);
  }
  next();
}; 