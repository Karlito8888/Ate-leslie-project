import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { User } from '../../models/User';
import { Message } from '../../models/Message';
import { generateToken } from '../../utils/auth';

describe('Admin Routes', () => {
  let adminToken: string;
  let userToken: string;
  let adminId: string;
  let userId: string;
  let messageId: string;

  beforeEach(async () => {
    // Nettoyer la base de données
    await User.deleteMany({});
    await Message.deleteMany({});

    // Créer un admin et un utilisateur pour les tests
    const admin = await User.create({
      username: 'testadmin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
      newsletterSubscribed: true
    });
    adminId = admin._id.toString();
    adminToken = generateToken(admin);

    const user = await User.create({
      username: 'testuser',
      email: 'user@test.com',
      password: 'password123',
      role: 'user',
      newsletterSubscribed: true
    });
    userId = user._id.toString();
    userToken = generateToken(user);

    // Créer un message test
    const message = await Message.create({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      content: 'Test Content'
    });
    messageId = message._id.toString();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/admin/stats', () => {
    it('should return stats when admin is authenticated', async () => {
      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.stats).toBeDefined();
      expect(response.body.data.stats.users).toBe(1);
      expect(response.body.data.stats.admins).toBe(1);
    });

    it('should reject when user is not admin', async () => {
      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/admin/users', () => {
    it('should return list of users when admin is authenticated', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.users).toBeDefined();
      expect(response.body.data.users.length).toBe(2);
      expect(response.body.data.users[0].password).toBeUndefined();
    });
  });

  describe('DELETE /api/admin/users/:id', () => {
    it('should delete a user when admin is authenticated', async () => {
      const response = await request(app)
        .delete(`/api/admin/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      const deletedUser = await User.findById(userId);
      expect(deletedUser).toBeNull();
    });

    it('should not allow deleting an admin', async () => {
      const response = await request(app)
        .delete(`/api/admin/users/${adminId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/admin/messages', () => {
    it('should return list of messages when admin is authenticated', async () => {
      const response = await request(app)
        .get('/api/admin/messages')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.messages).toBeDefined();
      expect(response.body.data.messages.length).toBeGreaterThan(0);
    });
  });

  describe('PATCH /api/admin/messages/:id/assign', () => {
    it('should assign message to admin', async () => {
      const response = await request(app)
        .patch(`/api/admin/messages/${messageId}/assign`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ admin: adminId });

      expect(response.status).toBe(200);
      expect(response.body.data.message.assignedTo.toString()).toBe(adminId);
      expect(response.body.data.message.status).toBe('assigned');
    });

    it('should fail with invalid admin id', async () => {
      const response = await request(app)
        .patch(`/api/admin/messages/${messageId}/assign`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ admin: userId }); // Using non-admin user ID

      expect(response.status).toBe(403);
    });
  });

  describe('PATCH /api/admin/messages/:id/status', () => {
    it('should update message status', async () => {
      const response = await request(app)
        .patch(`/api/admin/messages/${messageId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'resolved' });

      expect(response.status).toBe(200);
      expect(response.body.data.message.status).toBe('resolved');
    });
  });

  describe('POST /api/admin/messages/:id/reply', () => {
    it('should add reply to message', async () => {
      const response = await request(app)
        .post(`/api/admin/messages/${messageId}/reply`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ content: 'Test reply' });

      expect(response.status).toBe(200);
      expect(response.body.data.message.replies).toBeDefined();
      expect(response.body.data.message.replies.length).toBe(1);
      expect(response.body.data.message.replies[0].content).toBe('Test reply');
    });

    it('should fail if message does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .post(`/api/admin/messages/${fakeId}/reply`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ content: 'Test reply' });

      expect(response.status).toBe(404);
    });
  });
}); 