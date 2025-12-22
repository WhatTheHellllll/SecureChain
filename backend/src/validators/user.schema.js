import Joi from 'joi';

const updateUser = Joi.object({
  roleId: Joi.string().hex().length(24), // Valid Mongo ObjectID
  customPermissions: Joi.array().items(Joi.string()), // Must be array of strings
  deniedPermissions: Joi.array().items(Joi.string()),
  name: Joi.string().min(2).max(50), // Optional name update
});

export default {
  updateUser,
};
