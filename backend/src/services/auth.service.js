import { User } from "../models/user.model.js";
import { Role } from "../models/role.model.js";
import ErrorResponse from "../utils/error.response.js";
import { ROLES } from "../constants/roles.js";

/**
 * Authenticate a user by email and password
 * @param {string} email - User's email
 * @param {string} password - Plain text password
 * @param {Object} [req] - Express request (optional, for future audit logging)
 * @returns {Promise<Object>} The authenticated user document
 */
const loginUser = async (email, password, req) => {
  // Find User (explicitly select password to check it)
  const user = await User.findOne({ email })
    .select("+password")
    .populate("role");

  if (!user) {
    throw new ErrorResponse("Invalid credentials", 401);
  }

  // Check Password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new ErrorResponse("Invalid credentials", 401);
  }

  // Optional: You could call auditService.log("LOGIN", ...) here

  return user;
};

/**
 * Register a new user
 * @param {Object} userData - { name, email, password }
 * @param {Object} [req] - Express request
 * @returns {Promise<Object>} The new user document (populated)
 */
const registerUser = async (userData, req) => {
  const { name, email, password } = userData;

  // 1. Check Duplicates
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ErrorResponse("Email already registered", 400);
  }

  // 2. Find Default Role
  // FIX: Used 'ROLES.USER' instead of 'ROLE.USER'
  const userRole = await Role.findOne({ name: ROLES.USER });

  if (!userRole) {
    throw new ErrorResponse("System Error: Default 'user' role missing", 500);
  }

  // 3. Create User
  const newUser = await User.create({
    name,
    email,
    password,
    role: userRole._id,
  });

  // 4. Return Populated User
  // FIX: We must populate the role so the frontend receives the permissions immediately
  const populatedUser = await User.findById(newUser._id).populate("role");

  return populatedUser;
};

export default {
  loginUser,
  registerUser,
};
