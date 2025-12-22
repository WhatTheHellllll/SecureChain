import ErrorResponse from '../utils/error.response.js';

const validate = (schema) => (req, res, next) => {
  // options:
  // abortEarly: false -> checking all errors, not just the first one
  // stripUnknown: true -> removes fields not in schema (like _id, __v) instead of crashing
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    // Combine all error messages if there are multiple
    const message = error.details.map((detail) => detail.message).join(', ');
    return next(new ErrorResponse(message, 400));
  }

  // CRITICAL: Replace req.body with 'value'
  // 'value' is the clean object with only the allowed fields
  req.body = value;

  next();
};

export default validate;
