import ErrorResponse from "../utils/error.response.js";

/**
 * @desc    Global Error Handling Middleware
 * @param   {Error} err - The error object
 * @param   {import("express").Request} req
 * @param   {import("express").Response} res
 * @param   {import("express").NextFunction} next
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message; // Explicitly copy message as it's often lost in spread

  // Log to console for dev
  console.log(err);

  // 1. Mongoose Bad ObjectId (CastError)
  if (err.name === "CastError") {
    const message = `Resource not found`; // Cleaner than showing the raw ID
    error = new ErrorResponse(message, 404);
  }

  // 2. Mongoose Duplicate Key (code 11000)
  if (err.code === 11000) {
    // Extract the specific field that caused the duplicate (e.g., 'email')
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : "field";
    const message = `Duplicate value entered for ${field}`;
    error = new ErrorResponse(message, 400);
  }

  // 3. Mongoose Validation Error
  if (err.name === "ValidationError") {
    // Join array of messages into a single readable string
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");

    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

export default errorHandler;
