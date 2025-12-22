import Joi from 'joi';

const createProduct = Joi.object({
  name: Joi.string().required().trim().min(3).max(100),
  sku: Joi.string()
    .required()
    .trim()
    .pattern(/^[a-zA-Z0-9-_]+$/)
    .min(3),
  quantity: Joi.number().integer().min(0).required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().required().trim(),
  // description: Joi.string().optional() // Add if you have this field
});

const updateProduct = Joi.object({
  name: Joi.string().trim().min(3).max(100),
  sku: Joi.string()
    .trim()
    .pattern(/^[a-zA-Z0-9-_]+$/)
    .min(3),
  quantity: Joi.number().integer().min(0),
  price: Joi.number().min(0),
  category: Joi.string().trim(),
}).min(1); // Ensure at least one field is being updated

export default {
  createProduct,
  updateProduct,
};
