import { Request, Response, NextFunction } from 'express';
import { VALIDATION_RULES, ERROR_MESSAGES, HTTP_CODES, RESPONSE_STATUS, EVENT_CATEGORIES, EventCategory } from '../utils/constants';

type ValidationMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

export const validateCreateEvent: ValidationMiddleware = (req, res, next) => {
  const { title, description, location, startDate, endDate, maxParticipants, price, category } = req.body;
  const errors: string[] = [];

  if (!title || title.length < VALIDATION_RULES.EVENT.TITLE_MIN_LENGTH || 
      title.length > VALIDATION_RULES.EVENT.TITLE_MAX_LENGTH) {
    errors.push(ERROR_MESSAGES.TITLE_LENGTH);
  }

  if (!description || description.length < VALIDATION_RULES.EVENT.DESCRIPTION_MIN_LENGTH || 
      description.length > VALIDATION_RULES.EVENT.DESCRIPTION_MAX_LENGTH) {
    errors.push(ERROR_MESSAGES.DESCRIPTION_LENGTH);
  }

  if (!location || location.length < VALIDATION_RULES.EVENT.LOCATION_MIN_LENGTH) {
    errors.push(ERROR_MESSAGES.LOCATION_LENGTH);
  }

  if (!startDate || new Date(startDate) < new Date()) {
    errors.push(ERROR_MESSAGES.INVALID_DATE);
  }

  if (endDate && new Date(endDate) < new Date(startDate)) {
    errors.push(ERROR_MESSAGES.INVALID_END_DATE);
  }

  if (maxParticipants !== undefined && (!Number.isInteger(maxParticipants) || maxParticipants < 1)) {
    errors.push(ERROR_MESSAGES.INVALID_PARTICIPANTS);
  }

  if (price !== undefined && price < 0) {
    errors.push(ERROR_MESSAGES.INVALID_PRICE);
  }

  if (!category || !EVENT_CATEGORIES.includes(category as EventCategory)) {
    errors.push(ERROR_MESSAGES.INVALID_CATEGORY);
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

export const validateUpdateEvent: ValidationMiddleware = (req, res, next) => {
  const { title, description, location, startDate, endDate, maxParticipants, price, category } = req.body;
  const errors: string[] = [];

  if (title !== undefined && (title.length < VALIDATION_RULES.EVENT.TITLE_MIN_LENGTH || 
      title.length > VALIDATION_RULES.EVENT.TITLE_MAX_LENGTH)) {
    errors.push(ERROR_MESSAGES.TITLE_LENGTH);
  }

  if (description !== undefined && (description.length < VALIDATION_RULES.EVENT.DESCRIPTION_MIN_LENGTH || 
      description.length > VALIDATION_RULES.EVENT.DESCRIPTION_MAX_LENGTH)) {
    errors.push(ERROR_MESSAGES.DESCRIPTION_LENGTH);
  }

  if (location !== undefined && location.length < VALIDATION_RULES.EVENT.LOCATION_MIN_LENGTH) {
    errors.push(ERROR_MESSAGES.LOCATION_LENGTH);
  }

  if (startDate !== undefined && new Date(startDate) < new Date()) {
    errors.push(ERROR_MESSAGES.INVALID_DATE);
  }

  if (endDate !== undefined && startDate && new Date(endDate) < new Date(startDate)) {
    errors.push(ERROR_MESSAGES.INVALID_END_DATE);
  }

  if (maxParticipants !== undefined && (!Number.isInteger(maxParticipants) || maxParticipants < 1)) {
    errors.push(ERROR_MESSAGES.INVALID_PARTICIPANTS);
  }

  if (price !== undefined && price < 0) {
    errors.push(ERROR_MESSAGES.INVALID_PRICE);
  }

  if (category !== undefined && !EVENT_CATEGORIES.includes(category as EventCategory)) {
    errors.push(ERROR_MESSAGES.INVALID_CATEGORY);
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