// backend/src/routes/eventRoutes.ts

import { Router, RequestHandler } from 'express';
import { getAll, getOne, create, update, remove, search, addBookmark, removeBookmark } from '../controllers/eventController';
import { eventMiddlewares, eventUpdateMiddlewares } from '../middleware/eventMiddleware';
import { auth } from '../middleware/authMiddleware';
import reviewRoutes from './reviewRoutes';

/**
 * Routes de gestion des événements
 * Permet de créer, modifier, rechercher des événements
 * et gérer les favoris
 */
const router = Router();

// Routes imbriquées
router.use('/:eventId/reviews', reviewRoutes);  // Sous-routes pour les reviews d'un événement

// Routes publiques
router.get('/', getAll);                        // Liste de tous les événements
router.get('/search', search);                  // Recherche avancée avec filtres
router.get('/:id', getOne);                     // Détails d'un événement

// Routes authentifiées
router.post('/', auth, eventMiddlewares, create as RequestHandler);         // Créer un événement
router.put('/:id', auth, eventUpdateMiddlewares, update as RequestHandler); // Modifier son événement
router.delete('/:id', auth, eventUpdateMiddlewares, remove as RequestHandler); // Supprimer son événement

// Routes favoris
router.post('/:id/bookmark', auth, addBookmark as RequestHandler);          // Ajouter aux favoris
router.delete('/:id/bookmark', auth, removeBookmark as RequestHandler);     // Retirer des favoris

export default router; 