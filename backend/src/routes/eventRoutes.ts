// backend/src/routes/eventRoutes.ts

import express from 'express';
import {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  participateInEvent,
  cancelParticipation,
  createReview
} from '../controllers/eventController';
import { protect } from '../middleware/authMiddleware';
import { validateCreateEvent, validateUpdateEvent } from '../middleware/eventValidation';
import { validateCreateReview } from '../middleware/reviewValidation';
import { upload } from '../utils/uploadHandler';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - location
 *         - startDate
 *         - category
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *         description:
 *           type: string
 *           minLength: 10
 *           maxLength: 2000
 *         location:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         maxParticipants:
 *           type: integer
 *           minimum: 1
 *         price:
 *           type: number
 *           minimum: 0
 *         category:
 *           type: string
 *           enum: [concert, festival, theater, sport, other]
 *         images:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     tags: [Events]
 *     summary: List all events
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get('/', getAllEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     tags: [Events]
 *     summary: Get an event by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *       404:
 *         description: Event not found
 */
router.get('/:id', getEvent);

/**
 * @swagger
 * /api/events:
 *   post:
 *     tags: [Events]
 *     summary: Create a new event
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               maxParticipants:
 *                 type: integer
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Invalid data
 */
router.post('/', protect, upload.array('images', 5), validateCreateEvent, createEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   patch:
 *     tags: [Events]
 *     summary: Update an event
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               maxParticipants:
 *                 type: integer
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       404:
 *         description: Event not found
 */
router.patch('/:id', protect, upload.array('images', 5), validateUpdateEvent, updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     tags: [Events]
 *     summary: Delete an event
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 */
router.delete('/:id', protect, deleteEvent);

/**
 * @swagger
 * /api/events/{id}/participate:
 *   post:
 *     tags: [Events]
 *     summary: Register for an event
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully registered for the event
 *       400:
 *         description: Already participating or event is full
 */
router.post('/:id/participate', protect, participateInEvent);

/**
 * @swagger
 * /api/events/{id}/participate:
 *   delete:
 *     tags: [Events]
 *     summary: Cancel participation in an event
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully cancelled participation
 *       400:
 *         description: Not participating in the event
 */
router.delete('/:id/participate', protect, cancelParticipation);

/**
 * @swagger
 * /api/events/{id}/reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Add a review to an event
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
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 500
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: Invalid data or already reviewed
 */
router.post('/:id/reviews', protect, validateCreateReview, createReview);

export default router; 