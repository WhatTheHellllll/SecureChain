import ErrorResponse from "../utils/error.response.js";
import { User } from "../models/user.model.js";
import { PERMISSION_GROUPS } from "../constants/permissions.js";
import { ROLES } from "../constants/roles.js";
const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // Get the User with populated role
      const user = await User.findById(req.user._id).populate("role");

      if (!user) {
        return next(new ErrorResponse("User not found", 401));
      }

      // SUPER ADMIN OVERRIDE
      // If the user's role is 'super_admin' or 'sub_admin', they can do anything.
      if (
        user.role.name === ROLES.ADMIN ||
        user.role.name === ROLES.SUB_ADMIN
      ) {
        return next();
      }

      // gather all existing permissions of the role and the specific permissions
      const rolePerms = user.role.permissions || [];
      const customPerms = user.customPermissions || [];

      // combine existing permissions of the user
      let allPermissions = [...rolePerms, ...customPerms].flat();
      // CHECK FOR THE REQUIRED KEY
      // check for a wildcard '*' which means "All access"
      const hasPermission =
        allPermissions.includes(requiredPermission) ||
        allPermissions.includes("*");

      // CHECK FOR EXPLICIT BANS
      const isBanned =
        user.deniedPermissions &&
        user.deniedPermissions.includes(requiredPermission);

      if (!hasPermission || isBanned) {
        return next(
          new ErrorResponse(
            `You do not have permission to perform this action. Required: ${requiredPermission}`,
            403 // 403 = Forbidden (logged in, but not allowed)
          )
        );
      }

      next();
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  };
};
export { checkPermission };
