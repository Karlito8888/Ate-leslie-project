import { Router } from 'express';
import authRoutes from './authRoutes';
import eventRoutes from './eventRoutes';
import profileRoutes from './profileRoutes';
import contactRoutes from './contactRoutes';
import reviewRoutes from './reviewRoutes';
import adminUserRoutes from './adminUserRoutes';
import adminContactRoutes from './adminContactRoutes';
import adminMessagesRoutes from './adminMessagesRoutes';

const router = Router();

// Routes publiques
router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/profile', profileRoutes);
router.use('/contact', contactRoutes);
router.use('/reviews', reviewRoutes);

// Routes admin
router.use('/admin/users', adminUserRoutes);
router.use('/admin/contacts', adminContactRoutes);
router.use('/admin/messages', adminMessagesRoutes);

export default router; 