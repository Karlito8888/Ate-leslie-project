// Désactiver l'avertissement punycode
process.removeAllListeners('warning');

import { app } from './app';

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur le port ${port}`);
});
