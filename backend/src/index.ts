import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import { error } from './utils/responseHandler';

// Load environment variables
dotenv.config();

// Routes
import auth from './routes/authRoutes';
import event from './routes/eventRoutes';
import admin from './routes/adminRoutes';
import contact from './routes/contactRoutes';

// Documentation
import { setupDocs } from './docs/setup';

const app = express();

// Security middleware
app.use(helmet());
app.use(mongoSanitize());

// Basic middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Logger en dev
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Database
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('✅ Base de données connectée'))
  .catch(err => console.error('❌ Erreur de connexion à la base de données:', err));

// Documentation
if (process.env.NODE_ENV === 'development') {
  setupDocs(app);
}

// Routes
app.use('/api/auth', auth);
app.use('/api/events', event);
app.use('/api/admin', admin);
app.use('/api/contact', contact);

// Error handling
app.use((_: any, __: any, res: any) => {
  error(res, 404, 'Route non trouvée');
});

app.use((err: any, _: any, res: any, __: any) => {
  const isDev = process.env.NODE_ENV === 'development';
  console.error('❌ Erreur:', isDev ? err : err.message);
  error(res, err.status || 500, err.message || 'Erreur serveur');
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ Serveur démarré sur le port ${port} en mode ${process.env.NODE_ENV}`);
});
