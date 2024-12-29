import { Router } from 'express';
import { getStats, exportContacts, list, updateStatus, remove } from '../controllers/adminContactController';
import { auth, admin } from '../middleware/authMiddleware';

/**
 * Routes pour la gestion des messages de contact par l'admin
 * Toutes les routes nécessitent d'être admin
 */
const router = Router();

// Protection des routes admin
router.use(auth);
router.use(admin);

// Stats et métriques
router.get('/stats', getStats);      // Obtenir les statistiques (total, non lus, aujourd'hui)
router.get('/export', exportContacts); // Exporter tous les messages en CSV

// Gestion des messages
router.get('/', list);               // Liste paginée des messages avec filtres
router.patch('/:id/status', updateStatus); // Marquer comme lu/non lu/archivé
router.delete('/:id', remove);       // Supprimer un message

export default router; 