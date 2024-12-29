export const authSwagger = {
  '/api/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Créer un nouveau compte',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['username', 'email', 'password'],
              properties: {
                username: { type: 'string', minLength: 3 },
                email: { type: 'string', format: 'email' },
                password: { type: 'string', minLength: 6 }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Compte créé avec succès',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User'
              }
            }
          }
        }
      }
    }
  },
  '/api/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Se connecter',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Connexion réussie',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  token: { type: 'string' },
                  user: { $ref: '#/components/schemas/User' }
                }
              }
            }
          }
        }
      }
    }
  },
  '/api/auth/forgot-password': {
    post: {
      tags: ['Auth'],
      summary: 'Demander un reset de mot de passe',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email'],
              properties: {
                email: { type: 'string', format: 'email' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Email de réinitialisation envoyé',
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
  '/api/auth/reset-password': {
    post: {
      tags: ['Auth'],
      summary: 'Réinitialiser le mot de passe',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['token', 'password'],
              properties: {
                token: { type: 'string' },
                password: { type: 'string', minLength: 6 }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Mot de passe réinitialisé avec succès',
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
  '/api/auth/logout': {
    post: {
      tags: ['Auth'],
      summary: 'Se déconnecter',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Déconnexion réussie',
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