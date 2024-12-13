import { Request, Response, NextFunction } from 'express';
import { VALIDATION_RULES, ERROR_MESSAGES, HTTP_CODES, RESPONSE_STATUS, REGEX } from '../utils/constants';

export const validateContact = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, email, subject, message } = req.body;
  const errors: string[] = [];

  if (!name || name.length < VALIDATION_RULES.CONTACT.NAME_MIN_LENGTH || 
      name.length > VALIDATION_RULES.CONTACT.NAME_MAX_LENGTH) {
    errors.push(ERROR_MESSAGES.NAME_LENGTH);
  }

  if (!email || !REGEX.EMAIL.test(email)) {
    errors.push(ERROR_MESSAGES.INVALID_EMAIL);
  }

  if (!subject || subject.length < VALIDATION_RULES.CONTACT.SUBJECT_MIN_LENGTH || 
      subject.length > VALIDATION_RULES.CONTACT.SUBJECT_MAX_LENGTH) {
    errors.push(ERROR_MESSAGES.SUBJECT_LENGTH);
  }

  if (!message || message.length < VALIDATION_RULES.CONTACT.MESSAGE_MIN_LENGTH || 
      message.length > VALIDATION_RULES.CONTACT.MESSAGE_MAX_LENGTH) {
    errors.push(ERROR_MESSAGES.MESSAGE_LENGTH);
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