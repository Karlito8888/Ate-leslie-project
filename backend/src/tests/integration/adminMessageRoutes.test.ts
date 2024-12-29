import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../index';
import { User } from '../../models/User';
import { AdminMessage } from '../../models/AdminMessage';
import { generateToken } from '../../index';

describe('Admin Internal Message Routes', () => {
  let admin1Token: string;
  let admin2Token: string;
  let admin3Token: string;
  let admin1Id: mongoose.Types.ObjectId;
  let admin2Id: mongoose.Types.ObjectId;
  let admin3Id: mongoose.Types.ObjectId;
  let messageId: string;

  beforeEach(async () => {
    await User.deleteMany({});
    await AdminMessage.deleteMany({});

    // Créer trois admins avec des noms émiratis différents
    const admin1 = await User.create({
      username: 'admin1',
      email: 'admin1@test.com',
      password: 'password123',
      role: 'admin',
      newsletterSubscribed: true,
      fullName: {
        firstName: 'Ahmed',
        patronymicName: 'Khalifa',
        familyName: 'Al Futtaim',
        prefix: 'bin',
        honorificTitle: 'Sheikh',
        gender: 'male'
      }
    });

    const admin2 = await User.create({
      username: 'admin2',
      email: 'admin2@test.com',
      password: 'password123',
      role: 'admin',
      newsletterSubscribed: true,
      fullName: {
        firstName: 'Mohammed',
        patronymicName: 'Rashid',
        familyName: 'Al Maktoum',
        prefix: 'bin',
        honorificTitle: 'Sheikh',
        gender: 'male'
      }
    });

    const admin3 = await User.create({
      username: 'admin3',
      email: 'admin3@test.com',
      password: 'password123',
      role: 'admin',
      newsletterSubscribed: true,
      fullName: {
        firstName: 'Fatima',
        patronymicName: 'Mohammed',
        familyName: 'Al Nahyan',
        prefix: 'bint',
        honorificTitle: 'Sheikha',
        gender: 'female'
      }
    });

    admin1Id = admin1._id;
    admin2Id = admin2._id;
    admin3Id = admin3._id;
    admin1Token = generateToken(admin1Id.toString());
    admin2Token = generateToken(admin2Id.toString());
    admin3Token = generateToken(admin3Id.toString());

    // Créer des messages entre les admins
    const message = await AdminMessage.create({
      from: admin2Id,  // Admin2 envoie à Admin1
      to: admin1Id,
      subject: 'Mise à jour projet Dubai',
      content: 'Point sur l\'avancement du projet...',
      isRead: false
    });
    messageId = message._id.toString();

    await AdminMessage.create({
      from: admin3Id,  // Admin3 envoie à Admin1
      to: admin1Id,
      subject: 'Réunion mensuelle',
      content: 'Planning de la prochaine réunion...',
      isRead: false
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/admin/internal-messages/inbox', () => {
    it('should return inbox messages when authenticated as admin', async () => {
      const response = await request(app)
        .get('/api/admin/internal-messages/inbox')
        .set('Authorization', `Bearer ${admin1Token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.messages).toBeDefined();
      expect(response.body.data.messages.length).toBe(2);
      
      // Vérifier que les messages viennent bien des autres admins
      const messages = response.body.data.messages;
      expect(messages.some((m: any) => m.from.toString() === admin2Id.toString())).toBe(true);
      expect(messages.some((m: any) => m.from.toString() === admin3Id.toString())).toBe(true);
      
      // Vérifier que les messages ne sont pas lus
      expect(messages.every((m: any) => !m.isRead)).toBe(true);
    });

    it('should reject when not authenticated', async () => {
      const response = await request(app)
        .get('/api/admin/internal-messages/inbox');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/admin/internal-messages/sent', () => {
    it('should return sent messages', async () => {
      const response = await request(app)
        .get('/api/admin/internal-messages/sent')
        .set('Authorization', `Bearer ${admin2Token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.messages).toBeDefined();
      expect(response.body.data.messages.length).toBe(1);
      expect(response.body.data.messages[0].to.toString()).toBe(admin1Id.toString());
      expect(response.body.data.messages[0].subject).toBe('Mise à jour projet Dubai');
    });
  });

  describe('POST /api/admin/internal-messages', () => {
    it('should create a new message', async () => {
      const newMessage = {
        to: admin2Id,
        subject: 'Réponse projet Dubai',
        content: 'Voici mes commentaires sur le projet...'
      };

      const response = await request(app)
        .post('/api/admin/internal-messages')
        .set('Authorization', `Bearer ${admin1Token}`)
        .send(newMessage);

      expect(response.status).toBe(200);
      expect(response.body.data.message.from.toString()).toBe(admin1Id.toString());
      expect(response.body.data.message.to.toString()).toBe(admin2Id.toString());
      expect(response.body.data.message.isRead).toBe(false);
    });

    it('should reject message to non-admin user', async () => {
      const regularUser = await User.create({
        username: 'user',
        email: 'user@test.com',
        password: 'password123',
        role: 'user'
      });

      const response = await request(app)
        .post('/api/admin/internal-messages')
        .set('Authorization', `Bearer ${admin1Token}`)
        .send({
          to: regularUser._id,
          subject: 'Test',
          content: 'Test'
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Recipient must be an admin');
    });
  });

  describe('PATCH /api/admin/internal-messages/:id/read', () => {
    it('should mark message as read', async () => {
      const response = await request(app)
        .patch(`/api/admin/internal-messages/${messageId}/read`)
        .set('Authorization', `Bearer ${admin1Token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.message.isRead).toBe(true);

      // Vérifier en base que le message est bien marqué comme lu
      const updatedMessage = await AdminMessage.findById(messageId);
      expect(updatedMessage?.isRead).toBe(true);
    });

    it('should reject marking message as read by non-recipient', async () => {
      const response = await request(app)
        .patch(`/api/admin/internal-messages/${messageId}/read`)
        .set('Authorization', `Bearer ${admin3Token}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should handle non-existent message', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .patch(`/api/admin/internal-messages/${fakeId}/read`)
        .set('Authorization', `Bearer ${admin1Token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/admin/internal-messages/:id', () => {
    it('should return a specific message to recipient', async () => {
      const response = await request(app)
        .get(`/api/admin/internal-messages/${messageId}`)
        .set('Authorization', `Bearer ${admin1Token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.message.subject).toBe('Mise à jour projet Dubai');
      expect(response.body.data.message.from.fullName.firstName).toBe('Mohammed');
      expect(response.body.data.message.to.fullName.firstName).toBe('Ahmed');
    });

    it('should return a specific message to sender', async () => {
      const response = await request(app)
        .get(`/api/admin/internal-messages/${messageId}`)
        .set('Authorization', `Bearer ${admin2Token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.message.subject).toBe('Mise à jour projet Dubai');
    });

    it('should reject access to message by unrelated admin', async () => {
      const response = await request(app)
        .get(`/api/admin/internal-messages/${messageId}`)
        .set('Authorization', `Bearer ${admin3Token}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Not authorized to view this message');
    });

    it('should handle non-existent message', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/admin/internal-messages/${fakeId}`)
        .set('Authorization', `Bearer ${admin1Token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Message not found');
    });
  });

  describe('DELETE /api/admin/internal-messages/:id', () => {
    it('should allow recipient to delete message', async () => {
      const response = await request(app)
        .delete(`/api/admin/internal-messages/${messageId}`)
        .set('Authorization', `Bearer ${admin1Token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Message deleted successfully');

      // Vérifier que le message est bien supprimé
      const deletedMessage = await AdminMessage.findById(messageId);
      expect(deletedMessage).toBeNull();
    });

    it('should allow sender to delete message', async () => {
      const response = await request(app)
        .delete(`/api/admin/internal-messages/${messageId}`)
        .set('Authorization', `Bearer ${admin2Token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reject deletion by unrelated admin', async () => {
      const response = await request(app)
        .delete(`/api/admin/internal-messages/${messageId}`)
        .set('Authorization', `Bearer ${admin3Token}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Not authorized to delete this message');
    });

    it('should handle non-existent message', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/admin/internal-messages/${fakeId}`)
        .set('Authorization', `Bearer ${admin1Token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Message not found');
    });
  });
}); 