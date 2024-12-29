import { Router, RequestHandler } from 'express';
import { list, create, getOne, update, remove, togglePin } from '../controllers/adminMessagesController';
import { auth } from '../middleware/authMiddleware';
import { admin } from '../middleware/adminMiddleware';

/**
 * Routes pour la gestion des annonces système par l'admin
 * Permet de créer, modifier et gérer les annonces importantes
 * Toutes les routes nécessitent d'être admin
 */
const router = Router();

// Protection des routes admin
router.use(auth as RequestHandler);
router.use(admin as RequestHandler);

// Gestion des messages système
router.get('/', list as RequestHandler);           // Liste paginée des annonces
router.post('/', create as RequestHandler);        // Créer une nouvelle annonce
router.get('/:id', getOne as RequestHandler);      // Détails d'une annonce
router.patch('/:id', update as RequestHandler);    // Modifier une annonce
router.delete('/:id', remove as RequestHandler);   // Supprimer une annonce
router.patch('/:id/pin', togglePin as RequestHandler); // Épingler/désépingler une annonce

export default router; 