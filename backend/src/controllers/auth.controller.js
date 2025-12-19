import {User} from "../models/user.model.js";
import {Role} from "../models/role.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; 
import ErrorResponse from "../utils/error.response.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Login user & get token
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorResponse("Please provide email and password", 400));
    }

    // Find User (and grab their Role name)
    // We use .select('+password') because we set select:false in the model
    const user = await User.findOne({ email }).select("+password").populate("role");

    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check Password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Send Response (Token + User Data)
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        //role: user.role.name, // Sending the role name (e.g., "super_admin")
        //permissions: user.role.permissions // Sending capabilities
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    next(error);
  }
};

// @desc    Register a new user
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new ErrorResponse("Please provide all fields", 400));
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ErrorResponse("Email already registered", 400));
    }

    const userRole = await Role.findOne({ name: "user" });

    if (!userRole) {
      return next(new ErrorResponse("Error: Default 'user' role not found in DB", 500));
    }
    const user = await User.create({
      name,
      email,
      password,
      role: userRole._id // Assign the ID of the 'user' role
    });

    // Send Token immediately (so they are logged in)
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        role: userRole.name
      }
    });

  } catch (error) {
    next(error);
  }
}

export { login , register };