import { Router, RequestHandler } from 'express';
import { auth } from '../middleware/authMiddleware';
import { reviewMiddlewares } from '../middleware/reviewMiddleware';
import { add, list, update, remove } from '../controllers/reviewController';

/**
 * Routes de gestion des avis sur les événements
 * Permet de voir et gérer les reviews
 * Routes imbriquées sous /events/:eventId/reviews
 */
const router = Router({ mergeParams: true }); // Pour accéder aux params de la route parent

// Liste des reviews pour un événement
router.get('/', list as RequestHandler);                                      // Voir toutes les reviews d'un événement

// Ajouter une review
router.post('/', auth as RequestHandler, reviewMiddlewares, add as RequestHandler); // Ajouter une review

// Modifier/Supprimer sa propre review
router.patch('/:reviewId', auth as RequestHandler, reviewMiddlewares, update as RequestHandler); // Modifier sa review
router.delete('/:reviewId', auth as RequestHandler, remove as RequestHandler);  // Supprimer sa review

export default router; 