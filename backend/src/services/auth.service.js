import { User } from '../models/user.model.js';
import { Role } from '../models/role.model.js';
import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/error.response.js';

/**
 * Helper: Generate JWT Token
 * (Private to this service)
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

/**
 * Authenticate a user
 * @param {String} email
 * @param {String} password
 */
const loginUser = async (email, password) => {
  // Find User (explicitly select password)
  const user = await User.findOne({ email })
    .select('+password')
    .populate('role');

  if (!user) {
    throw new ErrorResponse('Invalid credentials', 401);
  }

  // Check Password (using Model method)
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new ErrorResponse('Invalid credentials', 401);
  }

  // Generate Token & Prepare Return Data
  const token = generateToken(user._id);

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role?.name || 'user', // Safety fallback
    },
  };
};

/**
 * Register a new user
 * @param {Object} userData - { name, email, password }
 */
const registerUser = async (userData) => {
  const { name, email, password } = userData;

  // Check Duplicates
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ErrorResponse('Email already registered', 400);
  }

  // Find Default Role
  const userRole = await Role.findOne({ name: 'user' });
  if (!userRole) {
    throw new ErrorResponse("Error: Default 'user' role not found in DB", 500);
  }

  // Create User
  const user = await User.create({
    name, // Added name to creation if your model supports it
    email,
    password,
    role: userRole._id,
  });

  // Generate Token
  const token = generateToken(user._id);

  return {
    token,
    user: {
      _id: user._id, // Consistent return format
      name: user.name,
      email: user.email,
      role: userRole.name,
    },
  };
};

export default {
  loginUser,
  registerUser,
};
