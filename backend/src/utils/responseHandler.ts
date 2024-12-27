// backend/src/utils/responseHandler.ts

import { Response } from 'express';

export const ok = (res: Response, data: any = {}, message: string = ''): Response => {
  return res.status(200).json({
    success: true,
    message,
    data
  });
};

export const created = (res: Response, data: any = {}, message: string = ''): Response => {
  return res.status(201).json({
    success: true,
    message,
    data
  });
};

export const error = (res: Response, status: number = 400, message: string = ''): Response => {
  return res.status(status).json({
    success: false,
    message
  });
}; 