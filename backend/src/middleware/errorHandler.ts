// backend/src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { HTTP_CODES, RESPONSE_STATUS } from '../utils/constants';
import { ApiError } from '../utils/modelHelpers';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof ApiError ? err.status : HTTP_CODES.INTERNAL_ERROR;
  const status = statusCode < 500 ? RESPONSE_STATUS.ERROR : 'error';

  res.status(statusCode).json({
    status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}; 

