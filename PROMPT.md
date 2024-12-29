# 🎯 PROMPT: Backend Minimaliste TypeScript/Express/MongoDB

## 🎨 Philosophie KISS (Keep It Simple, Stupid)
- Un code minimal mais robuste
- Une seule responsabilité par composant
- Simplicité > Complexité
- Maintenabilité > Élégance

## 🏗 Architecture MVC
```plaintext
src/
├── models/        # Schémas Mongoose simples
├── controllers/   # Logique métier basique
├── routes/        # Routes Express directes
├── middleware/    # Middlewares essentiels
├── utils/         # Fonctions utilitaires
└── config/        # Configuration centralisée
```

## 🛠 Stack Technique
- **Backend**: TypeScript, Express.js
- **Database**: MongoDB, Mongoose
- **Sécurité**: JWT, Helmet, CORS
- **Docs**: Swagger (dev mode)
- **Upload**: Multer
- **Emails**: Nodemailer

## 🔑 Fonctionnalités Core
1. **Auth**
   - Register/Login (JWT)
   - Rôles (User/Admin)
   - Password Reset

2. **Events**
   - CRUD basique
   - Upload fichiers

3. **Admin**
   - Gestion users
   - Scripts init

4. **Contact**
   - Form simple
   - Notifications email

## 📏 Standards de Code
1. **Simplicité**
   - Max 20-30 lignes/fonction
   - Noms explicites
   - Une fonction = une tâche
   - Pas de sur-ingénierie

2. **TypeScript**
   - Types explicites
   - Interfaces > Classes
   - Async/await
   - Strict mode

3. **Sécurité**
   - Headers sécurisés
   - Validation inputs
   - Sanitization data
   - Gestion erreurs centralisée

4. **Tests**
   - Unitaires (logique critique)
   - Intégration (flux principaux)
   - Coverage > 80%
   - Mocks simples

## 🎯 Objectifs Qualité
- Code maintenable
- Sécurité robuste
- Performance optimale
- Documentation claire
- Tests fiables

## ⚡️ Performance
- Optimisations si nécessaire
- Caching simple
- Pagination standard
- Requêtes optimisées

## 📚 Documentation
- README concis
- Swagger API
- JSDoc minimal
- Types clairs

## 🔒 Sécurité
- Helmet
- CORS configuré
- Validation entrées
- Sanitization MongoDB

## 🧪 Tests
- Jest
- Supertest
- Coverage > 80%
- CI/CD simple

## 📦 Dépendances
- Packages essentiels
- Versions fixes
- Solutions natives si possible
- Pas de micro-packages

## 🚀 Déploiement
- Scripts simples
- Env vars
- Logs basiques
- Monitoring essentiel 