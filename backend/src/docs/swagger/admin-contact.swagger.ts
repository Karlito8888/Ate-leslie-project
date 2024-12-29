export const adminContactSwagger = {
  '/api/admin/contacts/stats': {
    get: {
      tags: ['Admin Contact'],
      summary: 'Statistiques des messages de contact',
      responses: {
        200: {
          description: 'Statistiques',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  total: { type: 'integer' },
                  unread: { type: 'integer' },
                  today: { type: 'integer' }
                }
              }
            }
          }
        }
      }
    }
  },
  '/api/admin/contacts/export': {
    get: {
      tags: ['Admin Contact'],
      summary: 'Exporter les messages en CSV',
      responses: {
        200: {
          description: 'Fichier CSV',
          content: {
            'text/csv': {
              schema: {
                type: 'string',
                format: 'binary'
              }
            }
          }
        }
      }
    }
  },
  '/api/admin/contacts': {
    get: {
      tags: ['Admin Contact'],
      summary: 'Liste des messages de contact',
      parameters: [
        {
          in: 'query',
          name: 'page',
          schema: { type: 'integer', default: 1 }
        },
        {
          in: 'query',
          name: 'limit',
          schema: { type: 'integer', default: 10 }
        },
        {
          in: 'query',
          name: 'status',
          schema: { type: 'string', enum: ['new', 'read', 'archived'] }
        }
      ],
      responses: {
        200: {
          description: 'Liste paginée des messages',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  messages: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Contact' }
                  },
                  pagination: {
                    type: 'object',
                    properties: {
                      page: { type: 'integer' },
                      pages: { type: 'integer' },
                      total: { type: 'integer' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  '/api/admin/contacts/{id}/status': {
    patch: {
      tags: ['Admin Contact'],
      summary: 'Modifier le statut d\'un message',
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
              required: ['status'],
              properties: {
                status: { type: 'string', enum: ['new', 'read', 'archived'] }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Statut modifié',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Contact' }
            }
          }
        }
      }
    }
  },
  '/api/admin/contacts/{id}': {
    delete: {
      tags: ['Admin Contact'],
      summary: 'Supprimer un message',
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
          description: 'Message supprimé',
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