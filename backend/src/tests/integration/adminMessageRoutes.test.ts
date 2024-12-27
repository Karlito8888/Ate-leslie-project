import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { User } from '../../models/User';
import { AdminMessage } from '../../models/AdminMessage';
import { generateToken } from '../../utils/auth';

describe('Admin Internal Message Routes', () => {
  let adminToken: string;

  beforeAll(async () => {
    await User.deleteMany({});
    await AdminMessage.deleteMany({});

    const admin = await User.create({
      username: 'admin1',
      email: 'admin1@test.com',
      password: 'password123',
      role: 'admin'
    });
    adminToken = generateToken(admin);

    await AdminMessage.create({
      from: admin._id,
      to: admin._id,
      subject: 'Test Subject',
      content: 'Test Content'
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/admin/internal-messages/inbox', () => {
    it('should return inbox messages when authenticated as admin', async () => {
      const response = await request(app)
        .get('/api/admin/internal-messages/inbox')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.messages).toBeDefined();
      expect(response.body.data.messages.length).toBe(1);
    });

    it('should reject when not authenticated', async () => {
      const response = await request(app)
        .get('/api/admin/internal-messages/inbox');

      expect(response.status).toBe(401);
    });
  });
}); 