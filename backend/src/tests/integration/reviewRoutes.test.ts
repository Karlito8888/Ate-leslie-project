import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../index';
import { Review } from '../../models/Review';
import { Event } from '../../models/Event';
import { User } from '../../models/User';
import { generateToken } from '../../index';

describe('Review Routes', () => {
  let user: any;
  let userToken: string;
  let event: any;

  beforeEach(async () => {
    await Review.deleteMany({});
    await Event.deleteMany({});
    await User.deleteMany({});

    // Créer un utilisateur pour les tests
    user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });
    userToken = generateToken(user._id.toString());

    // Créer un événement pour les tests
    event = await Event.create({
      title: 'Test Event',
      desc: 'Test Description',
      date: new Date(),
      category: 'workshop',
      by: user._id,
      status: 'published'
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/events/:eventId/reviews', () => {
    it('should create a review and update event rating', async () => {
      const reviewData = {
        stars: 4,
        text: 'Great event!'
      };

      const response = await request(app)
        .post(`/api/events/${event._id}/reviews`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(reviewData);

      expect(response.status).toBe(201);
      expect(response.body.data.review.stars).toBe(4);
      expect(response.body.data.review.text).toBe('Great event!');

      // Vérifier que la note moyenne de l'événement a été mise à jour
      const updatedEvent = await Event.findById(event._id);
      expect(updatedEvent?.rating).toBe(4);
    });

    it('should prevent duplicate reviews from same user', async () => {
      // Créer une première review
      await Review.create({
        event: event._id,
        user: user._id,
        stars: 4,
        text: 'First review'
      });

      // Tenter de créer une deuxième review
      const response = await request(app)
        .post(`/api/events/${event._id}/reviews`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          stars: 5,
          text: 'Second review'
        });

      expect(response.status).toBe(400);
    });

    it('should reject invalid stars rating', async () => {
      const response = await request(app)
        .post(`/api/events/${event._id}/reviews`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          stars: 6, // Invalid: > 5
          text: 'Great event!'
        });

      expect(response.status).toBe(400);
    });

    it('should reject review with short text', async () => {
      const response = await request(app)
        .post(`/api/events/${event._id}/reviews`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          stars: 4,
          text: 'Hi' // Too short
        });

      expect(response.status).toBe(400);
    });

    it('should calculate average rating correctly', async () => {
      // Créer un deuxième utilisateur
      const user2 = await User.create({
        username: 'testuser2',
        email: 'test2@example.com',
        password: 'password123',
        role: 'user'
      });
      const user2Token = generateToken(user2._id.toString());

      // Première review : 4 étoiles
      await request(app)
        .post(`/api/events/${event._id}/reviews`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          stars: 4,
          text: 'Great event!'
        });

      // Deuxième review : 2 étoiles
      await request(app)
        .post(`/api/events/${event._id}/reviews`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({
          stars: 2,
          text: 'Not so great...'
        });

      // Vérifier que la moyenne est bien 3
      const updatedEvent = await Event.findById(event._id);
      expect(updatedEvent?.rating).toBe(3);
    });
  });
}); 