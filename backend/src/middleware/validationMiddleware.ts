import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { createApiError } from '../utils/modelHelpers';
import { MSG } from '../utils/constants';

export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id || req.params.messageId || req.params.eventId;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createApiError(400, MSG.bad_data));
  }
  
  next();
}; 