// Validation rules
export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50
  },
  PASSWORD: {
    MIN_LENGTH: 6
  },
  EVENT: {
    TITLE_MIN_LENGTH: 3,
    TITLE_MAX_LENGTH: 100,
    DESCRIPTION_MIN_LENGTH: 10,
    DESCRIPTION_MAX_LENGTH: 2000,
    LOCATION_MIN_LENGTH: 3
  },
  CONTACT: {
    NAME_MIN_LENGTH: 3,
    NAME_MAX_LENGTH: 50,
    SUBJECT_MIN_LENGTH: 3,
    SUBJECT_MAX_LENGTH: 100,
    MESSAGE_MIN_LENGTH: 10,
    MESSAGE_MAX_LENGTH: 2000,
  },
  REVIEW: {
    MIN_RATING: 1,
    MAX_RATING: 5,
    MIN_COMMENT_LENGTH: 10,
    MAX_COMMENT_LENGTH: 500
  }
} as const;

// Regular expressions
export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  PHONE: /^(\+\d{1,3}[- ]?)?\d{10}$/
} as const;

// HTTP status codes
export const HTTP_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
} as const;

// Response status
export const RESPONSE_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error'
} as const;

// Event categories
export const EVENT_CATEGORIES = ['concert', 'festival', 'theater', 'sport', 'other'] as const;
export type EventCategory = typeof EVENT_CATEGORIES[number];

// Error messages
export const ERROR_MESSAGES = {
  // Auth errors
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User already exists with this email',
  USER_NOT_FOUND: 'User not found',
  INVALID_TOKEN: 'Invalid or expired token',
  NOT_AUTHORIZED: 'You are not authorized to perform this action',
  NO_TOKEN: 'Not authorized, no token',
  MISSING_CREDENTIALS: 'Please provide email and password',
  MISSING_PASSWORDS: 'Please provide current and new password',
  CURRENT_PASSWORD_WRONG: 'Current password is incorrect',
  RESET_EMAIL_SENT: 'If your email exists in our database, you will receive a password reset link',
  
  // Validation errors
  USERNAME_LENGTH: `Username must be between ${VALIDATION_RULES.USERNAME.MIN_LENGTH} and ${VALIDATION_RULES.USERNAME.MAX_LENGTH} characters`,
  PASSWORD_LENGTH: `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`,
  INVALID_EMAIL: 'Please provide a valid email address',
  INVALID_PHONE: 'Please provide a valid phone number',
  
  // Event errors
  EVENT_NOT_FOUND: 'Event not found',
  TITLE_LENGTH: `Title must be between ${VALIDATION_RULES.EVENT.TITLE_MIN_LENGTH} and ${VALIDATION_RULES.EVENT.TITLE_MAX_LENGTH} characters`,
  DESCRIPTION_LENGTH: `Description must be between ${VALIDATION_RULES.EVENT.DESCRIPTION_MIN_LENGTH} and ${VALIDATION_RULES.EVENT.DESCRIPTION_MAX_LENGTH} characters`,
  LOCATION_LENGTH: `Location must be at least ${VALIDATION_RULES.EVENT.LOCATION_MIN_LENGTH} characters`,
  INVALID_DATE: 'Start date must be in the future',
  INVALID_END_DATE: 'End date must be after start date',
  INVALID_PARTICIPANTS: 'Maximum participants must be a positive number',
  INVALID_PRICE: 'Price cannot be negative',
  INVALID_CATEGORY: 'Invalid event category',
  ALREADY_PARTICIPATING: 'You are already participating in this event',
  NOT_PARTICIPATING: 'You are not participating in this event',
  EVENT_FULL: 'Event has reached maximum participants',
  
  // Review errors
  INVALID_RATING: `Rating must be between ${VALIDATION_RULES.REVIEW.MIN_RATING} and ${VALIDATION_RULES.REVIEW.MAX_RATING}`,
  INVALID_COMMENT: `Comment must be between ${VALIDATION_RULES.REVIEW.MIN_COMMENT_LENGTH} and ${VALIDATION_RULES.REVIEW.MAX_COMMENT_LENGTH} characters`,
  MUST_PARTICIPATE: 'You must participate in the event to leave a review',
  ALREADY_REVIEWED: 'You have already reviewed this event',
  
  // Admin errors
  CANNOT_DELETE_ADMIN: 'Cannot delete admin user',
  STATS_ERROR: 'Error retrieving statistics',

  // File errors
  INVALID_FILE_TYPE: 'File must be an image',
  FILE_TOO_LARGE: 'Image must not exceed 5MB',
  UPLOAD_ERROR: 'Error uploading image',

  // Contact errors
  NAME_LENGTH: 'Name must be between 2 and 100 characters',
  SUBJECT_LENGTH: 'Subject must be between 5 and 200 characters',
  MESSAGE_LENGTH: 'Message must be between 20 and 2000 characters',
  CONTACT_NOT_FOUND: 'Message not found'
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  USER_REGISTERED: 'User registered successfully',
  USER_LOGGED_IN: 'User logged in successfully',
  USER_LOGGED_OUT: 'User logged out successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  PASSWORD_RESET: 'Password reset successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  USER_DELETED: 'User deleted successfully',
  EVENT_CREATED: 'Event created successfully',
  EVENT_UPDATED: 'Event updated successfully',
  EVENT_DELETED: 'Event deleted successfully',
  EVENT_PARTICIPATION: 'Successfully registered for the event',
  EVENT_PARTICIPATION_CANCELLED: 'Successfully cancelled event participation',
  REVIEW_CREATED: 'Review submitted successfully',
  NEWSLETTER_SUBSCRIBED: 'Successfully subscribed to newsletter',
  NEWSLETTER_UNSUBSCRIBED: 'Successfully unsubscribed from newsletter',
  CONTACT_CREATED: 'Message sent successfully',
  CONTACT_UPDATED: 'Message status updated successfully'
} as const; 