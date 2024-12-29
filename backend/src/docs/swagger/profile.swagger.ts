export const profileSwagger = {
  '/api/profile': {
    get: {
      tags: ['Profile'],
      summary: 'Voir son profil',
      responses: {
        200: {
          description: 'Profil utilisateur',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' }
            }
          }
        }
      }
    },
    patch: {
      tags: ['Profile'],
      summary: 'Modifier son profil',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                username: { type: 'string' },
                email: { type: 'string', format: 'email' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Profil mis à jour',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' }
            }
          }
        }
      }
    }
  },
  '/api/profile/change-password': {
    post: {
      tags: ['Profile'],
      summary: 'Changer son mot de passe',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['currentPassword', 'newPassword'],
              properties: {
                currentPassword: { type: 'string' },
                newPassword: { type: 'string', minLength: 6 }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Mot de passe modifié',
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
  '/api/profile/events': {
    get: {
      tags: ['Profile'],
      summary: 'Voir ses événements créés',
      responses: {
        200: {
          description: 'Liste des événements créés',
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
  '/api/profile/reviews': {
    get: {
      tags: ['Profile'],
      summary: 'Voir ses reviews',
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
    }
  },
  '/api/profile/bookmarks': {
    get: {
      tags: ['Profile'],
      summary: 'Voir ses événements favoris',
      responses: {
        200: {
          description: 'Liste des événements favoris',
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
  }
}; 