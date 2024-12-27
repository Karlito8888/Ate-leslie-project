import request from 'supertest';
import { Types } from 'mongoose';
import { app } from '../../app';
import { Event } from '../../models/Event';
import { User } from '../../models/User';
import { generateToken } from '../../utils/auth';

describe('Event Routes', () => {
  let adminToken: string;
  let adminId: Types.ObjectId;

  beforeEach(async () => {
    // Nettoyer la base de données
    await Event.deleteMany({});
    await User.deleteMany({});

    // Créer un admin pour les tests
    adminId = new Types.ObjectId();

    await User.create({
      _id: adminId,
      username: 'admin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin'
    });

    adminToken = generateToken(adminId);
  });

  describe('GET /api/events', () => {
    it('should return list of events', async () => {
      // Arrange
      await Event.create({
        title: 'Test Event',
        desc: 'Test Description that is long enough',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // demain
        category: 'workshop',
        by: adminId,
        status: 'published'
      });

      // Act
      const response = await request(app)
        .get('/api/events')
        .expect(200);

      // Assert
      expect(response.body.data.events).toHaveLength(1);
      expect(response.body.data.events[0].title).toBe('Test Event');
    });

    it('should filter events by query parameters', async () => {
      // Arrange
      await Event.create([
        {
          title: 'Workshop A',
          desc: 'Workshop Description that is long enough',
          date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          category: 'workshop',
          by: adminId,
          status: 'published'
        },
        {
          title: 'Conference B',
          desc: 'Conference Description that is long enough',
          date: new Date(Date.now() + 48 * 60 * 60 * 1000),
          category: 'conference',
          by: adminId,
          status: 'published'
        }
      ]);

      // Act
      const response = await request(app)
        .get('/api/events?category=workshop')
        .expect(200);

      // Assert
      expect(response.body.data.events).toHaveLength(1);
      expect(response.body.data.events[0].title).toBe('Workshop A');
    });
  });

  describe('POST /api/events', () => {
    it('should create new event when authenticated as admin', async () => {
      // Arrange
      const newEvent = {
        title: 'New Event',
        desc: 'New Description that is long enough',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        category: 'workshop'
      };

      // Act
      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newEvent)
        .expect(201);

      // Assert
      expect(response.body.data.event.title).toBe('New Event');
    });

    it('should reject creation when not authenticated', async () => {
      // Arrange
      const newEvent = {
        title: 'New Event',
        desc: 'New Description that is long enough',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        category: 'workshop'
      };

      // Act & Assert
      await request(app)
        .post('/api/events')
        .send(newEvent)
        .expect(401);
    });
  });

  describe('PUT /api/events/:id', () => {
    it('should update event when authenticated as admin', async () => {
      // Arrange
      const event = await Event.create({
        title: 'Original Event',
        desc: 'Original Description that is long enough',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        category: 'workshop',
        by: adminId,
        status: 'draft'
      });

      const updates = {
        title: 'Updated Event',
        desc: 'Updated Description that is long enough',
        date: new Date(Date.now() + 48 * 60 * 60 * 1000),
        category: 'workshop',
        status: 'published'
      };

      // Act
      const response = await request(app)
        .put(`/api/events/${event._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates)
        .expect(200);

      // Assert
      expect(response.body.data.event.title).toBe('Updated Event');
      expect(response.body.data.event.status).toBe('published');
    });

    it('should reject update when not authenticated', async () => {
      // Arrange
      const event = await Event.create({
        title: 'Original Event',
        desc: 'Original Description that is long enough',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        category: 'workshop',
        by: adminId
      });

      // Act & Assert
      await request(app)
        .put(`/api/events/${event._id}`)
        .send({ title: 'Updated Event' })
        .expect(401);
    });
  });

  describe('DELETE /api/events/:id', () => {
    it('should delete event when authenticated as admin', async () => {
      // Arrange
      const event = await Event.create({
        title: 'Event to Delete',
        desc: 'Will be deleted - long enough description',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        category: 'workshop',
        by: adminId
      });

      // Act
      await request(app)
        .delete(`/api/events/${event._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      // Assert
      const deletedEvent = await Event.findById(event._id);
      expect(deletedEvent).toBeNull();
    });

    it('should reject deletion when not authenticated', async () => {
      // Arrange
      const event = await Event.create({
        title: 'Event to Delete',
        desc: 'Should not be deleted - long enough description',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        category: 'workshop',
        by: adminId
      });

      // Act & Assert
      await request(app)
        .delete(`/api/events/${event._id}`)
        .expect(401);

      // Verify event still exists
      const existingEvent = await Event.findById(event._id);
      expect(existingEvent).not.toBeNull();
    });
  });
}); 