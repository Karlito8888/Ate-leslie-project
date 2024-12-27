import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import mongoose from 'mongoose';

// Routes
import eventRoutes from './routes/eventRoutes';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import contactRoutes from './routes/contactRoutes';
import adminInternalMessageRoutes from './routes/adminInternalMessageRoutes';
import profileRoutes from './routes/profileRoutes';

// Swagger
import { swaggerSpec } from './utils/swagger';

// Configuration
config();
const app = express();

// Middleware de base
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes API
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin/internal-messages', adminInternalMessageRoutes);
app.use('/api/profile', profileRoutes);

// Documentation Swagger en développement
if (process.env.NODE_ENV === 'development') {
  const swaggerUi = require('swagger-ui-express');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Route pour accéder au JSON de la documentation
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

// Gestion des erreurs 404
app.use((_req, _res, next) => {
  const error = new Error('Not Found');
  next(error);
});

// Gestionnaire d'erreurs global
app.use(async (error: any, _req: any, res: any, _next: any) => {
  const statusCode = error.status || error.statusCode || 500;
  await res.status(statusCode).json({
    success: false,
    error: error.message || 'Une erreur est survenue'
  });
});

// Connexion à MongoDB
export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/events_db';
    await mongoose.connect(uri);
    console.log('✅ Connecté à MongoDB');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

export { app }; 