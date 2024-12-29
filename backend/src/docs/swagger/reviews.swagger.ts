export const reviewsSwagger = {
  '/api/events/{eventId}/reviews': {
    get: {
      tags: ['Reviews'],
      summary: 'Liste des reviews d\'un événement',
      parameters: [
        {
          in: 'path',
          name: 'eventId',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'Liste des reviews',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Review' }
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['Reviews'],
      summary: 'Ajouter une review',
      parameters: [
        {
          in: 'path',
          name: 'eventId',
          required: true,
          schema: { type: 'string' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['content', 'rating'],
              properties: {
                content: { type: 'string' },
                rating: { type: 'number', minimum: 1, maximum: 5 }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Review créée',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Review' }
            }
          }
        }
      }
    }
  },
  '/api/events/{eventId}/reviews/{reviewId}': {
    patch: {
      tags: ['Reviews'],
      summary: 'Modifier une review',
      parameters: [
        {
          in: 'path',
          name: 'eventId',
          required: true,
          schema: { type: 'string' }
        },
        {
          in: 'path',
          name: 'reviewId',
          required: true,
          schema: { type: 'string' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                content: { type: 'string' },
                rating: { type: 'number', minimum: 1, maximum: 5 }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Review modifiée',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Review' }
            }
          }
        }
      }
    },
    delete: {
      tags: ['Reviews'],
      summary: 'Supprimer une review',
      parameters: [
        {
          in: 'path',
          name: 'eventId',
          required: true,
          schema: { type: 'string' }
        },
        {
          in: 'path',
          name: 'reviewId',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'Review supprimée',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  }
}; 