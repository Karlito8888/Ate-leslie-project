import { Router, RequestHandler } from 'express';
import { list, getOne, updateRole, updateStatus, remove } from '../controllers/adminUserController';
import { auth } from '../middleware/authMiddleware';
import { admin } from '../middleware/adminMiddleware';

/**
 * Routes pour la gestion des utilisateurs par l'admin
 * Permet de gérer les comptes, rôles et accès
 * Toutes les routes nécessitent d'être admin
 */
const router = Router();

// Protection des routes admin
router.use(auth as RequestHandler);
router.use(admin as RequestHandler);

// Gestion des utilisateurs
router.get('/', list as RequestHandler);              // Liste paginée des utilisateurs
router.get('/:id', getOne as RequestHandler);         // Détails d'un utilisateur
router.patch('/:id/role', updateRole as RequestHandler);    // Changer le rôle (user/admin)
router.patch('/:id/status', updateStatus as RequestHandler); // Bloquer/débloquer un compte
router.delete('/:id', remove as RequestHandler);      // Supprimer un compte

export default router; 