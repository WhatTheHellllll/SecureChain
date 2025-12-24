import { User } from "../models/user.model.js";
import ErrorResponse from "../utils/error.response.js";
import { ROLES } from "../constants/roles.js";
/**
 * Get all users with their role details
 */
const getAllUsers = async (currentUser) => {
  let query = {};
  const roleName = currentUser.role?.name || "";
  if (roleName === ROLES.SUPER_ADMIN) {
    query = { _id: { $ne: currentUser._id } };
  } else if (roleName === ROLES.SUB_ADMIN) {
    // We use dot notation to query into the populated 'role' field
    // Note: This requires that you use .populate('role') in your find()
    query = {
      _id: { $ne: currentUser._id },
    };
  }

  // Use populate so the frontend gets the name,
  // and we can filter the final array if the ID query is too complex
  const users = await User.find(query).populate("role");

  // If the MongoDB query above is tricky with nested role names,
  // you can filter the final array here:
  if (roleName === ROLES.SUB_ADMIN) {
    return users.filter(
      (u) =>
        u.role?.name !== ROLES.SUPER_ADMIN && u.role?.name !== ROLES.SUB_ADMIN
    );
  }

  return users;
};

/**
 * Update user details (Role, Permissions, or Profile info)
 * @param {String} userId
 * @param {Object} updateData
 */
const updateUserRoleById = async (userId, updateData, adminUser) => {
  // 1. Find the user we want to edit
  const targetUser = await User.findById(userId).populate("role");
  if (!targetUser) {
    throw new ErrorResponse("User not found", 404);
  }

  // 2. --- HIERARCHY SECURITY CHECKS ---

  // If the person logged in is NOT a Super Admin, apply restrictions
  if (adminUser.role?.name !== ROLES.SUPER_ADMIN) {
    // Check A: Is the person being edited a Super Admin?
    if (targetUser.role?.name === ROLES.SUPER_ADMIN) {
      throw new ErrorResponse(
        "You are not authorized to modify a Super Admin",
        403
      );
    }

    // Check B: Is the person being edited at the SAME level? (e.g., Sub-Admin editing Sub-Admin)
    if (targetUser.role?.name === adminUser.role?.name) {
      throw new ErrorResponse(
        "You cannot modify users with the same role level as yours",
        403
      );
    }

    // Check C: Is the Admin trying to promote someone TO Super Admin?
    if (updateData.roleId) {
      // We need to fetch the name of the new role being assigned to verify it's not 'super_admin'
      const newRole = await Role.findById(updateData.roleId);
      if (!newRole) throw new Error("Target role not found");
      if (newRole && newRole.name === ROLES.SUPER_ADMIN) {
        throw new ErrorResponse(
          "Only Super Admins can assign the Super Admin role",
          403
        );
      }
    }
  }

  // 3. --- PROCEED WITH UPDATES (Only if checks passed) ---
  if (updateData.roleId) targetUser.role = updateData.roleId;
  if (updateData.customPermissions)
    targetUser.permissions = updateData.customPermissions;
  if (updateData.deniedPermissions)
    targetUser.deniedPermissions = updateData.deniedPermissions;
  if (updateData.name) targetUser.name = updateData.name;

  await targetUser.save();
  return targetUser;
};
export default {
  getAllUsers,
  updateUserRoleById,
};
