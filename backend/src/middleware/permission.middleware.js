import ErrorResponse from "../utils/error.response.js";
import User from "../models/user.model.js";

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // Get the User with populated role 
      const user = await User.findById(req.user._id).populate('role');

      if (!user) {
        return next(new ErrorResponse("User not found", 401));
      }

      // SUPER ADMIN OVERRIDE
      // If the user's role is 'super_admin', they can do anything.
      if (user.role.name === 'super_admin') {
        return next();
      }

      // Role's base permissions
      let allPermissions = [...user.role.permissions];

      // Custom Permissions
      if (user.customPermissions) {
        allPermissions = [...allPermissions, ...user.customPermissions];
      }

      // CHECK FOR THE REQUIRED KEY
      // check for a wildcard '*' which means "All access"
      const hasPermission = allPermissions.includes(requiredPermission) || 
                            allPermissions.includes('*');

      // CHECK FOR EXPLICIT BANS
      const isBanned = user.deniedPermissions && 
                       user.deniedPermissions.includes(requiredPermission);

      if (!hasPermission || isBanned) {
        return next(new ErrorResponse(
          `You do not have permission to perform this action. Required: ${requiredPermission}`, 
          403 // 403 = Forbidden (logged in, but not allowed)
        ));
      }

      next();

    } catch (error) {
      next(error);
    }
  };
};
export { checkPermission };