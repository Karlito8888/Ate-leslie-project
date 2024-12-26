import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ate Leslie API',
      version: '1.0.0',
      description: 'API Documentation pour le site web de Ate Leslie',
      contact: {
        name: 'Support Ate Leslie',
        email: process.env.EMAIL_FROM || 'support@ateleslie.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? process.env.API_URL || 'https://api.ateleslie.com'
          : `http://localhost:${process.env.PORT || 5000}`,
        description: `${process.env.NODE_ENV === 'production' ? 'Production' : 'Development'} server`
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Event: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            location: { type: 'string' },
            images: { type: 'array', items: { type: 'string' } },
            participants: { type: 'array', items: { $ref: '#/components/schemas/User' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Contact: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            message: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options); 