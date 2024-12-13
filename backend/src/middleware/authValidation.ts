import { Request, Response, NextFunction } from 'express';
import { VALIDATION_RULES, REGEX, ERROR_MESSAGES, HTTP_CODES, RESPONSE_STATUS } from '../utils/constants';

type ValidationMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

export const validateRegister: ValidationMiddleware = (req, res, next) => {
  const { username, email, password, phoneNumber } = req.body;
  const errors: string[] = [];

  if (!username || username.length < VALIDATION_RULES.USERNAME.MIN_LENGTH || 
      username.length > VALIDATION_RULES.USERNAME.MAX_LENGTH) {
    errors.push(ERROR_MESSAGES.USERNAME_LENGTH);
  }

  if (!email || !REGEX.EMAIL.test(email)) {
    errors.push(ERROR_MESSAGES.INVALID_EMAIL);
  }

  if (!password || password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    errors.push(ERROR_MESSAGES.PASSWORD_LENGTH);
  }

  if (phoneNumber && !REGEX.PHONE.test(phoneNumber)) {
    errors.push(ERROR_MESSAGES.INVALID_PHONE);
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

export const validateLogin: ValidationMiddleware = (req, res, next) => {
  const { email, password } = req.body;
  const errors: string[] = [];

  if (!email || !password) {
    errors.push(ERROR_MESSAGES.MISSING_CREDENTIALS);
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

export const validateChangePassword: ValidationMiddleware = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const errors: string[] = [];

  if (!currentPassword || !newPassword) {
    errors.push(ERROR_MESSAGES.MISSING_PASSWORDS);
  }

  if (newPassword && newPassword.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    errors.push(ERROR_MESSAGES.PASSWORD_LENGTH);
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

export const validateForgotPassword: ValidationMiddleware = (req, res, next) => {
  const { email } = req.body;
  const errors: string[] = [];

  if (!email || !REGEX.EMAIL.test(email)) {
    errors.push(ERROR_MESSAGES.INVALID_EMAIL);
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

export const validateResetPassword: ValidationMiddleware = (req, res, next) => {
  const { password } = req.body;
  const errors: string[] = [];

  if (!password || password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    errors.push(ERROR_MESSAGES.PASSWORD_LENGTH);
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

export const validateUpdateProfile: ValidationMiddleware = (req, res, next) => {
  const { username, phoneNumber } = req.body;
  const errors: string[] = [];

  if (username !== undefined && (username.length < VALIDATION_RULES.USERNAME.MIN_LENGTH || 
      username.length > VALIDATION_RULES.USERNAME.MAX_LENGTH)) {
    errors.push(ERROR_MESSAGES.USERNAME_LENGTH);
  }

  if (phoneNumber !== undefined && !REGEX.PHONE.test(phoneNumber)) {
    errors.push(ERROR_MESSAGES.INVALID_PHONE);
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