// Désactiver l'avertissement punycode
process.removeAllListeners('warning');

import { app, connectDB } from './app';

const port = process.env.PORT || 5000;

// Connexion à MongoDB puis démarrage du serveur
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Serveur démarré sur le port ${port}`);
  });
}).catch(error => {
  console.error('Erreur de démarrage:', error);
  process.exit(1);
});
