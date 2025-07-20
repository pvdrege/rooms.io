const Joi = require('joi');

// User registration validation
const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
    'any.required': 'Password is required'
  }),
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'First name must be at least 2 characters long',
    'string.max': 'First name cannot exceed 50 characters',
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Last name must be at least 2 characters long', 
    'string.max': 'Last name cannot exceed 50 characters',
    'any.required': 'Last name is required'
  })
});

// User login validation
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

// Profile update validation
const profileUpdateSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).messages({
    'string.min': 'First name must be at least 2 characters long',
    'string.max': 'First name cannot exceed 50 characters'
  }),
  lastName: Joi.string().min(2).max(50).messages({
    'string.min': 'Last name must be at least 2 characters long',
    'string.max': 'Last name cannot exceed 50 characters'
  }),
  displayName: Joi.string().min(2).max(50).allow('').messages({
    'string.min': 'Display name must be at least 2 characters long',
    'string.max': 'Display name cannot exceed 50 characters'
  }),
  bio: Joi.string().max(500).allow('').messages({
    'string.max': 'Bio cannot exceed 500 characters'
  }),
  location: Joi.string().max(100).allow('').messages({
    'string.max': 'Location cannot exceed 100 characters'
  }),
  website: Joi.string().uri().allow('').messages({
    'string.uri': 'Please provide a valid website URL'
  }),
  linkedinUrl: Joi.string().uri().allow('').messages({
    'string.uri': 'Please provide a valid LinkedIn URL'
  }),
  githubUrl: Joi.string().uri().allow('').messages({
    'string.uri': 'Please provide a valid GitHub URL'
  }),
  isVisible: Joi.boolean(),
  hashtags: Joi.array().items(Joi.number().integer().positive()).max(10).messages({
    'array.max': 'You can select maximum 10 hashtags',
    'number.integer': 'Invalid hashtag ID',
    'number.positive': 'Invalid hashtag ID'
  })
});

// Connection request validation
const connectionRequestSchema = Joi.object({
  addresseeId: Joi.number().integer().positive().required().messages({
    'number.integer': 'Invalid user ID',
    'number.positive': 'Invalid user ID',
    'any.required': 'Target user ID is required'
  }),
  message: Joi.string().max(500).allow('').messages({
    'string.max': 'Message cannot exceed 500 characters'
  })
});

// Message validation
const messageSchema = Joi.object({
  receiverId: Joi.number().integer().positive().required().messages({
    'number.integer': 'Invalid receiver ID',
    'number.positive': 'Invalid receiver ID',
    'any.required': 'Receiver ID is required'
  }),
  content: Joi.string().min(1).max(1000).required().messages({
    'string.min': 'Message cannot be empty',
    'string.max': 'Message cannot exceed 1000 characters',
    'any.required': 'Message content is required'
  })
});

// Meeting validation
const meetingSchema = Joi.object({
  title: Joi.string().min(3).max(200).required().messages({
    'string.min': 'Meeting title must be at least 3 characters long',
    'string.max': 'Meeting title cannot exceed 200 characters',
    'any.required': 'Meeting title is required'
  }),
  description: Joi.string().max(1000).allow('').messages({
    'string.max': 'Meeting description cannot exceed 1000 characters'
  }),
  scheduledAt: Joi.date().greater('now').required().messages({
    'date.greater': 'Meeting must be scheduled for a future date',
    'any.required': 'Meeting date is required'
  }),
  durationMinutes: Joi.number().integer().min(15).max(480).default(60).messages({
    'number.integer': 'Duration must be a whole number',
    'number.min': 'Meeting duration must be at least 15 minutes',
    'number.max': 'Meeting duration cannot exceed 8 hours'
  }),
  participants: Joi.array().items(Joi.number().integer().positive()).min(1).required().messages({
    'array.min': 'At least one participant is required',
    'any.required': 'Participants list is required'
  })
});

// Room creation validation
const roomSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Room name must be at least 3 characters long',
    'string.max': 'Room name cannot exceed 100 characters',
    'any.required': 'Room name is required'
  }),
  description: Joi.string().max(500).allow('').messages({
    'string.max': 'Room description cannot exceed 500 characters'
  }),
  isPrivate: Joi.boolean().default(false)
});

// Validation middleware function
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all errors
      stripUnknown: true // Remove unknown fields
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    // Replace req.body with validated data
    req.body = value;
    next();
  };
};

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  profileUpdateSchema,
  connectionRequestSchema,
  messageSchema,
  meetingSchema,
  roomSchema
}; 