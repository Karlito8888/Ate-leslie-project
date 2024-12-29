import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import { authSwagger } from './swagger/auth.swagger';
import { eventsSwagger } from './swagger/events.swagger';
import { profileSwagger } from './swagger/profile.swagger';
import { contactSwagger } from './swagger/contact.swagger';
import { reviewsSwagger } from './swagger/reviews.swagger';
import { adminUsersSwagger } from './swagger/admin-users.swagger';
import { adminMessagesSwagger } from './swagger/admin-messages.swagger';
import { adminContactSwagger } from './swagger/admin-contact.swagger';
import { schemas } from './swagger/schemas.swagger';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Ate Leslie',
    version: '1.0.0',
    description: 'Documentation de l\'API Ate Leslie',
    contact: {
      name: 'Ate Leslie',
      email: 'contact@ate-leslie.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Serveur de développement',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas
  },
  tags: [
    { name: 'Auth', description: 'Authentification et gestion des comptes' },
    { name: 'Events', description: 'Gestion des événements' },
    { name: 'Reviews', description: 'Gestion des avis' },
    { name: 'Profile', description: 'Gestion du profil utilisateur' },
    { name: 'Contact', description: 'Formulaire de contact et newsletter' },
    { name: 'Admin Users', description: 'Gestion des utilisateurs (admin)' },
    { name: 'Admin Messages', description: 'Gestion des messages système (admin)' },
    { name: 'Admin Contact', description: 'Gestion des messages de contact (admin)' }
  ],
  security: [
    { bearerAuth: [] }
  ],
  paths: {
    ...authSwagger,
    ...eventsSwagger,
    ...profileSwagger,
    ...contactSwagger,
    ...reviewsSwagger,
    ...adminUsersSwagger,
    ...adminMessagesSwagger,
    ...adminContactSwagger
  }
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'], // pour garder la compatibilité avec les commentaires JSDoc si présents
};

export const setupSwagger = (app: Express) => {
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Ate Leslie - Documentation',
  }));

  app.get('/api-docs.json', (_, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}; 