import Joi from 'joi';
import { VALID_PERMISSIONS } from '../constants/permissions.js';

// Schema for POST /api/v1/roles
const createRoleSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required().messages({
    'string.empty': 'Role name cannot be empty',
    'any.required': 'Role name is required',
  }),

  description: Joi.string()
    .allow('') // Allow empty string
    .max(200)
    .optional(),

  permissions: Joi.array()
    .items(
      Joi.string().valid(...VALID_PERMISSIONS) // 🔒 Must be one of your real permissions
    )
    .unique() // Remove duplicates automatically
    .default([]), // If not sent, default to empty array
});

// Schema for PUT /api/v1/roles/:id
const updateRoleSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50), // Optional for updates

  description: Joi.string().allow('').max(200),

  permissions: Joi.array()
    .items(Joi.string().valid(...VALID_PERMISSIONS))
    .unique(),
});

export default { createRoleSchema, updateRoleSchema };
