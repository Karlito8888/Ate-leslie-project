import request from 'supertest';
import { app, generateToken } from '../../index';
import { User } from '../../models/User';
import bcrypt from 'bcryptjs';

// Augmenter le timeout global pour les tests d'intégration
jest.setTimeout(10000);

describe('Profile Routes', () => {
  let user: any;
  let userToken: string;

  beforeEach(async () => {
    await User.deleteMany({});
    const hashedPassword = await bcrypt.hash('password123', 10);
    user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user',
      newsletterSubscribed: true
    });
    userToken = generateToken(user._id.toString());
  });

  describe('Profile Management', () => {
    it('should get profile when authenticated', async () => {
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data.user.username).toBe('testuser');
    });

    it('should update basic profile info successfully', async () => {
      const response = await request(app)
        .patch('/api/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          username: 'newusername',
          email: 'new@example.com',
          newsletterSubscribed: false
        });

      expect(response.status).toBe(200);
      expect(response.body.data.user.username).toBe('newusername');
      expect(response.body.data.user.email).toBe('new@example.com');
    });

    describe('Full Name Management', () => {
      it('should update fullName with Emirati format', async () => {
        const fullName = {
          firstName: 'Mohammed',
          patronymicName: 'Rashid',
          familyName: 'Al Maktoum',
          prefix: 'bin',
          honorificTitle: 'Sheikh',
          gender: 'male'
        };

        const response = await request(app)
          .patch('/api/profile')
          .set('Authorization', `Bearer ${userToken}`)
          .send({ fullName });

        expect(response.status).toBe(200);
        expect(response.body.data.user.fullName).toEqual(fullName);
      });

      it('should update fullName with expatriate format', async () => {
        const fullName = {
          firstName: 'John',
          familyName: 'Smith',
          gender: 'male',
          preferredName: 'Johnny'
        };

        const response = await request(app)
          .patch('/api/profile')
          .set('Authorization', `Bearer ${userToken}`)
          .send({ fullName });

        expect(response.status).toBe(200);
        expect(response.body.data.user.fullName).toEqual(fullName);
      });

      it('should reject fullName without required fields', async () => {
        const response = await request(app)
          .patch('/api/profile')
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            fullName: {
              firstName: 'Mohammed'
              // gender manquant
            }
          });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      it('should reject invalid honorific title', async () => {
        const response = await request(app)
          .patch('/api/profile')
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            fullName: {
              firstName: 'Mohammed',
              gender: 'male',
              honorificTitle: 'InvalidTitle'
            }
          });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      it('should reject invalid prefix', async () => {
        const response = await request(app)
          .patch('/api/profile')
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            fullName: {
              firstName: 'Mohammed',
              gender: 'male',
              prefix: 'invalid'
            }
          });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      it('should update female name with correct prefix and title', async () => {
        const fullName = {
          firstName: 'Fatima',
          patronymicName: 'Mohammed',
          familyName: 'Al Maktoum',
          prefix: 'bint',
          honorificTitle: 'Sheikha',
          gender: 'female'
        };

        const response = await request(app)
          .patch('/api/profile')
          .set('Authorization', `Bearer ${userToken}`)
          .send({ fullName });

        expect(response.status).toBe(200);
        expect(response.body.data.user.fullName).toEqual(fullName);
      });
    });

    it('should update address successfully with UAE format', async () => {
      const updatedAddress = {
        unit: 'Apt 707',
        buildingName: 'White Swan Building',
        street: 'Sheikh Zayed Road 34',
        area: 'Al Wasl',
        poBox: '54321',
        emirate: 'DU',
        country: 'ARE'
      };

      const response = await request(app)
        .patch('/api/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          address: updatedAddress
        });

      expect(response.status).toBe(200);
      expect(response.body.data.user.address).toEqual(updatedAddress);
    });

    it('should reject invalid emirate code', async () => {
      const response = await request(app)
        .patch('/api/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          address: {
            emirate: 'INVALID'
          }
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject invalid email format', async () => {
      const response = await request(app)
        .patch('/api/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ email: 'invalid-email' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: 'Format d\'email invalide'
      });
    });

    it('should reject unauthorized access', async () => {
      const response = await request(app).get('/api/profile');
      expect(response.status).toBe(401);
    });
  });

  describe('Password Management', () => {
    it('should change password successfully', async () => {
      const response = await request(app)
        .post('/api/profile/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'NewPassword123!',
          confirmPassword: 'NewPassword123!'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reject login with old password after change', async () => {
      await request(app)
        .post('/api/profile/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'NewPassword123!',
          confirmPassword: 'NewPassword123!'
        });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: 'password123'
        });

      expect(response.status).toBe(401);
    });

    it('should allow login with new password', async () => {
      await request(app)
        .post('/api/profile/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'NewPassword123!',
          confirmPassword: 'NewPassword123!'
        });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: 'NewPassword123!'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reject mismatched passwords', async () => {
      const response = await request(app)
        .post('/api/profile/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'NewPassword123!',
          confirmPassword: 'DifferentPassword123!'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'Les mots de passe ne correspondent pas'
      });
    });

    it('should reject incorrect current password', async () => {
      const response = await request(app)
        .post('/api/profile/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'NewPassword123!',
          confirmPassword: 'NewPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    });
  });
}); 