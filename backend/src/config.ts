import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ate-leslie',
  jwtSecret: process.env.JWT_SECRET || 'default_secret',
  email: {
    host: process.env.EMAIL_HOST || 'smtp.example.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER || 'user@example.com',
    pass: process.env.EMAIL_PASS || 'password',
    from: process.env.EMAIL_FROM || 'noreply@example.com'
  }
}; 