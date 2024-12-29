import request from 'supertest';
import { app, SECURITY, generateToken } from '../../index';
import { User } from '../../models/User';
import bcrypt from 'bcryptjs';

describe('Auth Routes', () => {
  let resetToken: string;
  
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@test.com',
          password: 'Password123!',
          username: 'TestUser'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.newsletterSubscribed).toBe(true);
    });

    it('should register a new user with newsletter subscription disabled', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@test.com',
          password: 'Password123!',
          username: 'TestUser',
          newsletterSubscribed: false
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.newsletterSubscribed).toBe(false);
    });

    it('should reject registration with invalid data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid',
          password: '123',
          username: 'T'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash('Password123!', SECURITY.SALT_ROUNDS);
      await User.create({
        email: 'test@test.com',
        password: hashedPassword,
        username: 'TestUser',
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
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'Password123!'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.fullName.honorificTitle).toBe('Sheikha');
      expect(res.body.data.user.fullName.prefix).toBe('bint');
    });

    it('should reject login with invalid credentials', async () => {
      try {
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@test.com',
            password: 'WrongPassword123!'
          });

        console.log('Response:', {
          status: res.status,
          body: res.body
        });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Email ou mot de passe incorrect');
      } catch (error) {
        console.error('Test error:', error);
        throw error;
      }
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@test.com',
          password: 'Password123!',
          username: 'TestUser'
        });
    });

    it('should send reset token for valid email', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'test@test.com'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should handle non-existent email gracefully', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'nonexistent@test.com'
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/reset-password/:token', () => {
    beforeEach(async () => {
      const user = await User.create({
        email: 'test@test.com',
        password: 'Password123!',
        username: 'TestUser'
      });
      resetToken = generateToken(user._id);
      user.resetToken = resetToken;
      user.resetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
      await user.save();
    });

    it('should reset password with valid token', async () => {
      const res = await request(app)
        .post(`/api/auth/reset-password/${resetToken}`)
        .send({
          password: 'NewPassword123!'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should reject invalid reset token', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password/invalidtoken')
        .send({
          password: 'NewPassword123!'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
}); 