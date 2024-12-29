import { Router, RequestHandler } from 'express';
import { send, getFaq, subscribeNewsletter, unsubscribeNewsletter } from '../controllers/contactController';
import { validateContact } from '../middleware/contactMiddleware';

/**
 * Routes de contact et newsletter
 * Gère les messages de contact et inscriptions newsletter
 * Routes publiques ne nécessitant pas d'authentification
 */
const router = Router();

// Contact et support
router.post('/', validateContact as RequestHandler, send as RequestHandler);  // Envoyer un message de contact
router.get('/faq', getFaq as RequestHandler);                                // Obtenir la FAQ

// Newsletter
router.post('/newsletter', subscribeNewsletter as RequestHandler);           // S'inscrire à la newsletter
router.delete('/newsletter', unsubscribeNewsletter as RequestHandler);       // Se désinscrire de la newsletter

export default router; 