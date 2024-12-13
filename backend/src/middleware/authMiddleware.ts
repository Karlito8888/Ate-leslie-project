// backend/src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/User';
import { ERROR_MESSAGES, HTTP_CODES } from '../utils/constants';
import { createApiError } from '../utils/modelHelpers';

interface JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: UserRole;
      };
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw createApiError(HTTP_CODES.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw createApiError(HTTP_CODES.UNAUTHORIZED, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    req.user = {
      id: user._id.toString(),
      role: user.role
    };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(createApiError(HTTP_CODES.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN));
    } else {
      next(error);
    }
  }
};

export const restrictTo = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw createApiError(HTTP_CODES.FORBIDDEN, ERROR_MESSAGES.NOT_AUTHORIZED);
    }
    next();
  };
}; 