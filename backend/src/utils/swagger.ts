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
            newsletterSubscribed: { type: 'boolean' },
            mobileNumber: { type: 'string', nullable: true },
            landlineNumber: { type: 'string', nullable: true },
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
            category: { type: 'string' },
            images: { type: 'array', items: { type: 'string' } },
            rating: { type: 'number', minimum: 0, maximum: 5 },
            reviews: { type: 'array', items: { $ref: '#/components/schemas/Review' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Review: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            eventId: { type: 'string' },
            userId: { type: 'string' },
            stars: { type: 'number', minimum: 1, maximum: 5 },
            text: { type: 'string', minLength: 10 },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Contact: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            subject: { type: 'string' },
            message: { type: 'string' },
            status: { type: 'string', enum: ['new', 'assigned', 'in-progress', 'resolved'] },
            assignedTo: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        AdminMessage: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            from: { type: 'string' },
            to: { type: 'string' },
            subject: { type: 'string' },
            content: { type: 'string' },
            read: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', default: false },
            error: { type: 'string' }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', default: true },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }],
    paths: {
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Inscription d\'un nouvel utilisateur',
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
                    password: { type: 'string', minLength: 6 },
                    newsletterSubscribed: { type: 'boolean', default: true }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Utilisateur créé avec succès',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Success' }
                }
              }
            },
            400: {
              description: 'Données invalides',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Connexion utilisateur',
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
                  schema: { $ref: '#/components/schemas/Success' }
                }
              }
            },
            401: {
              description: 'Identifiants invalides',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      },
      '/api/profile': {
        get: {
          tags: ['Profile'],
          summary: 'Récupérer le profil utilisateur',
          responses: {
            200: {
              description: 'Profil récupéré avec succès',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Success' }
                }
              }
            }
          }
        },
        patch: {
          tags: ['Profile'],
          summary: 'Mettre à jour le profil utilisateur',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    username: { type: 'string', minLength: 3 },
                    email: { type: 'string', format: 'email' },
                    newsletterSubscribed: { type: 'boolean' },
                    mobileNumber: { type: 'string', nullable: true },
                    landlineNumber: { type: 'string', nullable: true }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Profil mis à jour avec succès',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Success' }
                }
              }
            }
          }
        }
      },
      '/api/profile/change-password': {
        post: {
          tags: ['Profile'],
          summary: 'Changer le mot de passe',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['currentPassword', 'newPassword', 'confirmPassword'],
                  properties: {
                    currentPassword: { type: 'string' },
                    newPassword: { type: 'string', minLength: 6 },
                    confirmPassword: { type: 'string', minLength: 6 }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Mot de passe changé avec succès',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Success' }
                }
              }
            }
          }
        }
      },
      '/api/events': {
        get: {
          tags: ['Events'],
          summary: 'Liste des événements',
          security: [],
          parameters: [
            {
              in: 'query',
              name: 'category',
              schema: { type: 'string' },
              description: 'Filtrer par catégorie'
            }
          ],
          responses: {
            200: {
              description: 'Liste des événements récupérée avec succès',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          events: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Event' }
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
        post: {
          tags: ['Events'],
          summary: 'Créer un nouvel événement',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'description', 'date', 'location', 'category'],
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    date: { type: 'string', format: 'date-time' },
                    location: { type: 'string' },
                    category: { type: 'string' },
                    images: { type: 'array', items: { type: 'string' } }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Événement créé avec succès',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Success' }
                }
              }
            }
          }
        }
      },
      '/api/events/{eventId}/reviews': {
        post: {
          tags: ['Reviews'],
          summary: 'Ajouter une review à un événement',
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
                  required: ['stars', 'text'],
                  properties: {
                    stars: { type: 'number', minimum: 1, maximum: 5 },
                    text: { type: 'string', minLength: 10 }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Review ajoutée avec succès',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Success' }
                }
              }
            }
          }
        }
      },
      '/api/contact': {
        post: {
          tags: ['Contact'],
          summary: 'Envoyer un message de contact',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'subject', 'message'],
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    subject: { type: 'string' },
                    message: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Message envoyé avec succès',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Success' }
                }
              }
            }
          }
        },
        get: {
          tags: ['Admin'],
          summary: 'Liste des messages de contact (admin)',
          responses: {
            200: {
              description: 'Liste des messages récupérée avec succès',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          messages: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Contact' }
                          }
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
      '/api/admin/internal-messages/inbox': {
        get: {
          tags: ['Admin'],
          summary: 'Boîte de réception des messages internes (admin)',
          responses: {
            200: {
              description: 'Messages récupérés avec succès',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          messages: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/AdminMessage' }
                          }
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
      '/api/auth/forgot-password': {
        post: {
          tags: ['Auth'],
          summary: 'Demande de réinitialisation de mot de passe',
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
                  schema: { $ref: '#/components/schemas/Success' }
                }
              }
            }
          }
        }
      },
      '/api/auth/reset-password/{token}': {
        post: {
          tags: ['Auth'],
          summary: 'Réinitialisation du mot de passe',
          security: [],
          parameters: [
            {
              in: 'path',
              name: 'token',
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
                  required: ['password', 'confirmPassword'],
                  properties: {
                    password: { type: 'string', minLength: 6 },
                    confirmPassword: { type: 'string', minLength: 6 }
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
                  schema: { $ref: '#/components/schemas/Success' }
                }
              }
            }
          }
        }
      },
      '/api/admin/users': {
        get: {
          tags: ['Admin'],
          summary: 'Liste des utilisateurs',
          responses: {
            200: {
              description: 'Liste des utilisateurs récupérée avec succès',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          users: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/User' }
                          }
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
        delete: {
          tags: ['Admin'],
          summary: 'Supprimer un utilisateur',
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
              description: 'Utilisateur supprimé avec succès',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Success' }
                }
              }
            }
          }
        }
      },
      '/api/admin/messages': {
        get: {
          tags: ['Admin'],
          summary: 'Liste des messages de contact',
          responses: {
            200: {
              description: 'Liste des messages récupérée avec succès',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          messages: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Contact' }
                          }
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
      '/api/admin/messages/{id}/assign': {
        patch: {
          tags: ['Admin'],
          summary: 'Assigner un message à un admin',
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
                  required: ['adminId'],
                  properties: {
                    adminId: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Message assigné avec succès',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Success' }
                }
              }
            }
          }
        }
      },
      '/api/admin/messages/{id}/status': {
        patch: {
          tags: ['Admin'],
          summary: 'Mettre à jour le statut d\'un message',
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
                    status: { 
                      type: 'string',
                      enum: ['new', 'assigned', 'in-progress', 'resolved']
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Statut mis à jour avec succès',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Success' }
                }
              }
            }
          }
        }
      },
      '/api/admin/messages/{id}/reply': {
        post: {
          tags: ['Admin'],
          summary: 'Répondre à un message',
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
                  required: ['reply'],
                  properties: {
                    reply: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Réponse envoyée avec succès',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Success' }
                }
              }
            }
          }
        }
      },
      '/api/admin/stats': {
        get: {
          tags: ['Admin'],
          summary: 'Statistiques du site',
          responses: {
            200: {
              description: 'Statistiques récupérées avec succès',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          users: { type: 'number' },
                          events: { type: 'number' },
                          messages: { type: 'number' }
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
      '/api/admin/internal-messages/sent': {
        get: {
          tags: ['Admin'],
          summary: 'Messages internes envoyés',
          responses: {
            200: {
              description: 'Messages récupérés avec succès',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          messages: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/AdminMessage' }
                          }
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
      '/api/admin/internal-messages': {
        post: {
          tags: ['Admin'],
          summary: 'Envoyer un message interne',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['to', 'subject', 'content'],
                  properties: {
                    to: { type: 'string' },
                    subject: { type: 'string' },
                    content: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Message envoyé avec succès',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Success' }
                }
              }
            }
          }
        }
      },
      '/api/admin/internal-messages/{id}/read': {
        patch: {
          tags: ['Admin'],
          summary: 'Marquer un message comme lu',
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
              description: 'Message marqué comme lu avec succès',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Success' }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options); 