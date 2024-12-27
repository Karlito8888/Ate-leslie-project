import express from 'express';
import { getProfile, updateProfile, changePassword } from '../controllers/profileController';
import { auth } from '../middleware/authMiddleware';
import { validatePasswordChange } from '../middleware/authValidation';

const router = express.Router();

router.get('/', auth, getProfile);
router.patch('/', auth, updateProfile);
router.post('/change-password', auth, validatePasswordChange, changePassword);

export default router; 