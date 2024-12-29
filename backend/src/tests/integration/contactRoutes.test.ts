import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../index';
import { Contact } from '../../models/Contact';
import { User } from '../../models/User';
import { generateToken } from '../../index';

// Mock du service d'email pour éviter l'envoi réel
jest.mock('../../utils/email', () => ({
  send: jest.fn().mockResolvedValue(true)
}));

describe('Contact Routes', () => {
  let admin: any;
  let adminToken: string;

  beforeEach(async () => {
    await Contact.deleteMany({});
    await User.deleteMany({});

    // Créer un admin pour les tests qui nécessitent une authentification
    admin = await User.create({
      username: 'admin1',
      email: 'admin1@test.com',
      password: 'password123',
      role: 'admin'
    });
    adminToken = generateToken(admin);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/contact', () => {
    it('should create a contact message', async () => {
      const contactData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        msg: 'This is a test message that is long enough to pass validation'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData);

      console.log('Contact creation response:', response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.message).toBeDefined();
      expect(response.body.data.message.name).toBe(contactData.name);
    });
  });

  describe('GET /api/contact', () => {
    it('should return contact messages when authenticated as admin', async () => {
      // Créer un message de test
      await Contact.create({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'This is a test message'
      });

      const response = await request(app)
        .get('/api/contact')
        .set('Authorization', `Bearer ${adminToken}`);

      console.log('Contact list response:', response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.messages).toBeDefined();
      expect(Array.isArray(response.body.data.messages)).toBe(true);
      expect(response.body.data.messages.length).toBe(1);
    });

    it('should reject when not authenticated', async () => {
      const response = await request(app)
        .get('/api/contact');

      expect(response.status).toBe(401);
    });
  });
}); 