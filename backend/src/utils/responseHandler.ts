// backend/src/utils/responseHandler.ts

import { Response } from 'express';

interface ResponseData {
  status: 'success' | 'error';
  statusCode: number;
  message?: string;
  data?: any;
  token?: string;
}

export const sendResponse = (res: Response, { status, statusCode, message, data, token }: ResponseData): void => {
  const response: any = { status };
  
  if (message) response.message = message;
  if (data) response.data = data;
  if (token) response.token = token;
  
  res.status(statusCode).json(response);
}; 