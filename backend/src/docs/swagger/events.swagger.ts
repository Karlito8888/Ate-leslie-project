export const eventsSwagger = {
  '/api/events': {
    get: {
      tags: ['Events'],
      summary: 'Liste de tous les événements',
      security: [],
      responses: {
        200: {
          description: 'Liste des événements',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Event' }
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['Events'],
      summary: 'Créer un nouvel événement',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['title', 'description', 'date', 'location'],
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                date: { type: 'string', format: 'date-time' },
                location: { type: 'string' },
                category: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Événement créé',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Event' }
            }
          }
        }
      }
    }
  },
  '/api/events/search': {
    get: {
      tags: ['Events'],
      summary: 'Recherche avancée d\'événements',
      security: [],
      parameters: [
        {
          in: 'query',
          name: 'query',
          schema: { type: 'string' },
          description: 'Terme de recherche'
        },
        {
          in: 'query',
          name: 'category',
          schema: { type: 'string' }
        },
        {
          in: 'query',
          name: 'startDate',
          schema: { type: 'string', format: 'date' }
        },
        {
          in: 'query',
          name: 'endDate',
          schema: { type: 'string', format: 'date' }
        },
        {
          in: 'query',
          name: 'location',
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'Liste des événements filtrés',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Event' }
              }
            }
          }
        }
      }
    }
  },
  '/api/events/{id}': {
    get: {
      tags: ['Events'],
      summary: 'Détails d\'un événement',
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'Détails de l\'événement',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Event' }
            }
          }
        }
      }
    },
    put: {
      tags: ['Events'],
      summary: 'Modifier un événement',
      parameters: [
        {
          in: 'path',
          name: 'id',
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
                title: { type: 'string' },
                description: { type: 'string' },
                date: { type: 'string', format: 'date-time' },
                location: { type: 'string' },
                category: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Événement modifié',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Event' }
            }
          }
        }
      }
    },
    delete: {
      tags: ['Events'],
      summary: 'Supprimer un événement',
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'Événement supprimé',
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
  },
  '/api/events/{id}/bookmark': {
    post: {
      tags: ['Events'],
      summary: 'Ajouter aux favoris',
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'Événement ajouté aux favoris',
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
    },
    delete: {
      tags: ['Events'],
      summary: 'Retirer des favoris',
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'Événement retiré des favoris',
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