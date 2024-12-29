export const adminUsersSwagger = {
  '/api/admin/users': {
    get: {
      tags: ['Admin Users'],
      summary: 'Liste des utilisateurs',
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
        }
      ],
      responses: {
        200: {
          description: 'Liste paginée des utilisateurs',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  users: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/User' }
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
  '/api/admin/users/{id}': {
    get: {
      tags: ['Admin Users'],
      summary: 'Détails d\'un utilisateur',
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
          description: 'Détails de l\'utilisateur',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' }
            }
          }
        }
      }
    }
  },
  '/api/admin/users/{id}/role': {
    patch: {
      tags: ['Admin Users'],
      summary: 'Changer le rôle d\'un utilisateur',
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
              required: ['role'],
              properties: {
                role: { type: 'string', enum: ['user', 'admin'] }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Rôle modifié',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' }
            }
          }
        }
      }
    }
  },
  '/api/admin/users/{id}/status': {
    patch: {
      tags: ['Admin Users'],
      summary: 'Bloquer/débloquer un utilisateur',
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
                status: { type: 'string', enum: ['active', 'blocked'] }
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
              schema: { $ref: '#/components/schemas/User' }
            }
          }
        }
      }
    }
  }
}; 