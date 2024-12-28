import request from 'supertest';
import { app } from '../../app';
import { User } from '../../models/User';
import { generateToken, hash } from '../../utils/auth';
import bcrypt from 'bcryptjs';

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

    it('should reject unauthorized access', async () => {
      const response = await request(app).get('/api/profile');
      expect(response.status).toBe(401);
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

      // Mettre à jour l'utilisateur pour les tests suivants
      user = await User.findById(user._id);
    });

    it('should reject invalid email format', async () => {
      const response = await request(app)
        .patch('/api/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ email: 'invalid-email' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Format d\'email invalide');
    }, 60000);
  });

  describe('Password Management', () => {
    it('should handle password change flow', async () => {
      // 1. Changer le mot de passe
      const changeResponse = await request(app)
        .post('/api/profile/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'NewPassword123!',
          confirmPassword: 'NewPassword123!'
        });

      expect(changeResponse.status).toBe(200);
      expect(changeResponse.body.success).toBe(true);

      // 2. Essayer de se connecter avec l'ancien mot de passe (devrait échouer)
      const oldLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: 'password123'
        });

      expect(oldLoginResponse.status).toBe(401);

      // 3. Se connecter avec le nouveau mot de passe
      const newLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: 'NewPassword123!'
        });

      expect(newLoginResponse.status).toBe(200);
      expect(newLoginResponse.body.success).toBe(true);

      // 4. Tester le rejet de mot de passe incorrect
      const incorrectResponse = await request(app)
        .post('/api/profile/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'AnotherPassword123!',
          confirmPassword: 'AnotherPassword123!'
        });

      expect(incorrectResponse.status).toBe(401);
      expect(incorrectResponse.body.error).toBe('Mot de passe actuel incorrect');

      // 5. Tester le rejet de mots de passe non correspondants
      const mismatchResponse = await request(app)
        .post('/api/profile/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: 'NewPassword123!',
          newPassword: 'AnotherPassword123!',
          confirmPassword: 'DifferentPassword123!'
        });

      expect(mismatchResponse.status).toBe(400);
      expect(mismatchResponse.body.error).toBe('Les mots de passe ne correspondent pas');
    }, 60000);
  });
}); 