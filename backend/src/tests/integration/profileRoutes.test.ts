import request from 'supertest';
import { app } from '../../app';
import { User } from '../../models/User';
import { generateToken, hash } from '../../utils/auth';

// Augmenter le timeout global pour les tests d'intégration
jest.setTimeout(10000);

describe('Profile Routes', () => {
  let user: any;
  let userToken: string;

  beforeEach(async () => {
    await User.deleteMany({});
    const hashedPassword = await hash('password123');
    user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user',
      newsletterSubscribed: true
    });
    userToken = generateToken(user);
  });

  describe('Profile Management', () => {
    it('should get profile when authenticated', async () => {
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data.user.username).toBe('testuser');
    });

    it('should update profile successfully', async () => {
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

    it('should reject invalid email format', async () => {
      const response = await request(app)
        .patch('/api/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ email: 'invalid-email' });

      // Vérifier que l'erreur est bien retournée comme attendu
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
      // D'abord changer le mot de passe
      await request(app)
        .post('/api/profile/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'NewPassword123!',
          confirmPassword: 'NewPassword123!'
        });

      // Essayer de se connecter avec l'ancien mot de passe
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: 'password123'
        });

      expect(response.status).toBe(401);
    });

    it('should allow login with new password', async () => {
      // D'abord changer le mot de passe
      await request(app)
        .post('/api/profile/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'NewPassword123!',
          confirmPassword: 'NewPassword123!'
        });

      // Se connecter avec le nouveau mot de passe
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

      // Vérifier que l'erreur est bien retournée comme attendu
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

      // Vérifier que l'erreur est bien retournée comme attendu
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    });
  });
}); 