// backend/src/utils/auth.ts

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const hash = (pass: string) => bcrypt.hash(pass, 8);

export const check = (pass: string, hash: string) => bcrypt.compare(pass, hash);

export const token = (id: string) => jwt.sign({ id }, 'secret', { expiresIn: '1d' });

export const generateReset = () => {
  const raw = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  return { raw, hash };
};

