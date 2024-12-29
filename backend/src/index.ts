import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

import { errorHandler, notFound } from './middleware/errorMiddleware';
import routes from './routes';
import { setupSwagger } from './docs/swagger';

// App config
export const APP = {
  PORT: Number(process.env.PORT) || 5000,
  IS_DEV: process.env.NODE_ENV !== 'production'
} as const;

// JWT config
export const JWT = {
  SECRET: process.env.JWT_SECRET!,
  EXPIRES: '24h',
  SALT: 10
} as const;

// Auth utils
export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT.SECRET, { expiresIn: JWT.EXPIRES });
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcryptjs.hash(password, JWT.SALT);
};

// App setup
export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api', routes);

if (APP.IS_DEV) {
  setupSwagger(app);
}

app.use(notFound);
app.use(errorHandler);

// Start server
async function start(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    app.listen(APP.PORT, () => console.log(`🚀 Server running on ${APP.PORT}`));
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
}

if (require.main === module) start(); 