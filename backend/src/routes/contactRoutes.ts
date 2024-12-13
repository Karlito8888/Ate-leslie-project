import { Router } from 'express';
import { createContact, getAllContacts, updateContactStatus } from '../controllers/contactController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { validateContact } from '../middleware/contactValidation';

const router = Router();

/**
 * @swagger
 * /api/contact:
 *   post:
 *     tags: [Contact]
 *     summary: Send a contact message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent successfully
 */
router.post('/', validateContact, createContact);

/**
 * @swagger
 * /api/contact:
 *   get:
 *     tags: [Contact]
 *     summary: Get all messages (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of messages
 */
router.get('/', protect, restrictTo(['admin']), getAllContacts);

/**
 * @swagger
 * /api/contact/{id}:
 *   patch:
 *     tags: [Contact]
 *     summary: Update message status (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [unread, read, replied]
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.patch('/:id', protect, restrictTo(['admin']), updateContactStatus);

export default router; 