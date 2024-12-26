export const CATS = ['concert', 'festival', 'theater', 'sport', 'other'];

export const RULES = {
  name: { min: 3, max: 50 },
  pass: { min: 6 },
  text: { min: 10, max: 2000 },
  stars: { min: 1, max: 5 }
};

export const EMAIL = /^[^@]+@[^@]+\.[a-z]{2,}$/i;

export const MSG = {
  // Auth
  bad_auth: 'Bad email/pass',
  no_token: 'No token',
  bad_token: 'Bad token',
  no_user: 'No user',
  exists: 'Email taken',
  no_admin: 'Admin only',
  
  // Data
  bad_data: 'Bad data',
  not_found: 'Not found',
  no_access: 'Not yours',
  
  // Events
  in_event: 'Already in',
  not_in: 'Not in',
  full: 'Full',
  
  // Generic
  error: 'Error',
  ok: 'OK'
}; 