import mongoose from 'mongoose';
import { config } from 'dotenv';
import path from 'path';

// Définir l'environnement de test
process.env.NODE_ENV = 'test';

// Charger les variables d'environnement de test
config({ path: path.resolve(__dirname, '../../.env.test') });

// Configuration globale de Jest
jest.setTimeout(30000);

// Mock des services externes
jest.mock('../utils/email', () => ({
  send: jest.fn().mockResolvedValue(true)
}));

// Connexion à la base de test avant tous les tests
beforeAll(async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ate-leslie-test';
  await mongoose.connect(mongoUri);
  console.log('✅ Connecté à la base de test');
});

// Nettoyage après chaque test
afterEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
  // Réinitialiser tous les mocks
  jest.clearAllMocks();
});

// Fermeture de la connexion après tous les tests
afterAll(async () => {
  if (mongoose.connection) {
    await mongoose.disconnect();
  }
  console.log('✅ Déconnexion de la base de test');
}); 