export const contactSwagger = {
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
          description: 'Message envoyé',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Contact' }
            }
          }
        }
      }
    }
  },
  '/api/contact/faq': {
    get: {
      tags: ['Contact'],
      summary: 'Récupérer la FAQ',
      security: [],
      responses: {
        200: {
          description: 'FAQ',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    question: { type: 'string' },
                    answer: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  '/api/contact/newsletter': {
    post: {
      tags: ['Contact'],
      summary: 'S\'inscrire à la newsletter',
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
          description: 'Inscription réussie',
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
      tags: ['Contact'],
      summary: 'Se désinscrire de la newsletter',
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
          description: 'Désinscription réussie',
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