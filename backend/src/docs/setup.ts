import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../utils/swagger';

export const setupDocs = (app: Express) => {
  // Interface Swagger
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Ate Leslie - Documentation',
  }));

  // Endpoint JSON pour la documentation
  app.get('/docs.json', (_, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}; 