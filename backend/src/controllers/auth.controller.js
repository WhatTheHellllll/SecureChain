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
// @route   POST /api/v1/auth/login
// @access  Public
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
// const adminEmail = "admin@securechain.com";
//     const adminExists = await User.findOne({ email: adminEmail });

//     if (!adminExists) {
//       // Hash password manually since we are bypassing the model .save() hook logic sometimes, 
//       // but sticking to standard create() is safer.
//       // However, since we defined the pre-save hook in user.model.js, 
//       // passing the plain text password here is actually correct! 
//       // The model will hash it for us.
      
//       await User.create({
//         name: "Sokun Admin",
//         email: adminEmail,
//         password: "password123", // The hook in your model will hash this!
//         role: adminRole._id,     // Link to the Role ID we just found/created
//         status: "active",
//         customPermissions: [],
//         deniedPermissions: []
//       });
      
//       console.log(`👤 Admin User Created: ${adminEmail} / password123`);
//     } else {
//       console.log("ℹ️ Admin User already exists");
//     }
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