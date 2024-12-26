// backend/src/utils/responseHandler.ts

import { Response } from 'express';

type Status = 'ok' | 'error';
type Data = Record<string, any>;

interface ApiResponse {
  status: Status;
  code: number;
  msg?: string;
  data?: Data;
}

const send = (res: Response, { status, code, msg, data }: ApiResponse) => {
  const response: Data = { status };
  if (msg) response.msg = msg;
  if (data) response.data = data;
  res.status(code).json(response);
};

export const ok = (res: Response, data?: Data, msg?: string) => 
  send(res, { status: 'ok', code: 200, data, msg });

export const created = (res: Response, data?: Data, msg?: string) => 
  send(res, { status: 'ok', code: 201, data, msg });

export const error = (res: Response, code: number = 400, msg: string = 'Error') => 
  send(res, { status: 'error', code, msg }); 