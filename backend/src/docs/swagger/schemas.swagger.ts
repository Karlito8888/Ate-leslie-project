export const schemas = {
  User: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      username: { type: 'string' },
      email: { type: 'string' },
      role: { type: 'string', enum: ['user', 'admin'] },
      newsletterSubscribed: { type: 'boolean' }
    }
  },
  Event: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      title: { type: 'string' },
      description: { type: 'string' },
      date: { type: 'string', format: 'date-time' },
      location: { type: 'string' },
      category: { type: 'string' },
      creator: { $ref: '#/components/schemas/User' }
    }
  },
  Review: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      content: { type: 'string' },
      rating: { type: 'number', minimum: 1, maximum: 5 },
      event: { $ref: '#/components/schemas/Event' },
      author: { $ref: '#/components/schemas/User' }
    }
  },
  Contact: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      name: { type: 'string' },
      email: { type: 'string' },
      subject: { type: 'string' },
      message: { type: 'string' },
      status: { type: 'string', enum: ['new', 'read', 'archived'] }
    }
  },
  Message: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      title: { type: 'string' },
      content: { type: 'string' },
      type: { type: 'string', enum: ['info', 'warning', 'error'] },
      author: { $ref: '#/components/schemas/User' },
      pinned: { type: 'boolean' }
    }
  }
}; 