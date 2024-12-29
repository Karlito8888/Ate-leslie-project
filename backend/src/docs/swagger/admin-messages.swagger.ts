export const adminMessagesSwagger = {
  '/api/admin/messages': {
    get: {
      tags: ['Admin Messages'],
      summary: 'Liste des messages système',
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
          name: 'pinned',
          schema: { type: 'boolean' }
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
                    items: { $ref: '#/components/schemas/Message' }
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
    },
    post: {
      tags: ['Admin Messages'],
      summary: 'Créer un message système',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['title', 'content', 'type'],
              properties: {
                title: { type: 'string' },
                content: { type: 'string' },
                type: { type: 'string', enum: ['info', 'warning', 'error'] },
                pinned: { type: 'boolean', default: false }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Message créé',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Message' }
            }
          }
        }
      }
    }
  },
  '/api/admin/messages/{id}': {
    get: {
      tags: ['Admin Messages'],
      summary: 'Détails d\'un message système',
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
          description: 'Détails du message',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Message' }
            }
          }
        }
      }
    },
    patch: {
      tags: ['Admin Messages'],
      summary: 'Modifier un message système',
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
                content: { type: 'string' },
                type: { type: 'string', enum: ['info', 'warning', 'error'] },
                pinned: { type: 'boolean' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Message modifié',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Message' }
            }
          }
        }
      }
    },
    delete: {
      tags: ['Admin Messages'],
      summary: 'Supprimer un message système',
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
  },
  '/api/admin/messages/{id}/pin': {
    patch: {
      tags: ['Admin Messages'],
      summary: 'Épingler/désépingler un message',
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
          description: 'Statut d\'épinglage modifié',
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