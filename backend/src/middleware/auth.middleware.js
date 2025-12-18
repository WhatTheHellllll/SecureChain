import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";

// Check for token and reattach user to request
const protect = async (req, res, next) => {
  let token;

  // Check if header exists and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (Format: "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the ID in the token
      // attach the user to the request object
      req.user = await User.findById(payload.id);

      if (!req.user) {
         return res.status(401).json({ message: "User not found" });
      }

      next(); 
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// 2. The "Role" Guard (Checks for Admin)
// We can use this later to say "Only Admins can delete"
const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user was set by the 'protect' middleware above
    // We access the role name from the populated object or string
    // Note: Since we populated 'role' in the login, but here we just fetched User.
    // If your User model stores role as ObjectId, we might need to populate it here too.
    // FOR NOW, let's assume you populated it or check the ID.
    // (We will refine this when we test Role logic).
    
    // Simple version if role was just a string:
    // if (!roles.includes(req.user.role)) { ... }
    
    next();
  };
};

export { protect , authorize };