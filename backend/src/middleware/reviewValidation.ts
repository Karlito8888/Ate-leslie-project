import { Request, Response, NextFunction } from 'express';
import { VALIDATION_RULES, ERROR_MESSAGES, HTTP_CODES, RESPONSE_STATUS } from '../utils/constants';

type ValidationMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

export const validateCreateReview: ValidationMiddleware = (req, res, next) => {
  const { rating, comment } = req.body;
  const errors: string[] = [];

  if (!rating || !Number.isInteger(rating) || rating < VALIDATION_RULES.REVIEW.MIN_RATING || 
      rating > VALIDATION_RULES.REVIEW.MAX_RATING) {
    errors.push(ERROR_MESSAGES.INVALID_RATING);
  }

  if (!comment || comment.length < VALIDATION_RULES.REVIEW.MIN_COMMENT_LENGTH || 
      comment.length > VALIDATION_RULES.REVIEW.MAX_COMMENT_LENGTH) {
    errors.push(ERROR_MESSAGES.INVALID_COMMENT);
  }

  if (errors.length > 0) {
    res.status(HTTP_CODES.BAD_REQUEST).json({
      status: RESPONSE_STATUS.ERROR,
      errors
    });
    return;
  }

  next();
}; 