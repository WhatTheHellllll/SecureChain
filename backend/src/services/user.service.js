import { User } from "../models/user.model.js";
import ErrorResponse from "../utils/error.response.js";
import { ROLES } from "../constants/roles.js";
import { Role } from "../models/role.model.js";
/**
 * Get all users with their role details
 */
const getAllUsers = async (currentUser) => {
  let query = { isActive: { $ne: false } };
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

  //filter the final array:
  if (roleName === ROLES.SUB_ADMIN) {
    return users.filter(
      (u) =>
        u.role?.name !== ROLES.SUPER_ADMIN && u.role?.name !== ROLES.SUB_ADMIN
    );
  }

  return users;
};

/**
 * Deactivates a user account (Soft Delete)
 * @param {string} id - The target user's ID
 * @param {string} adminId - The ID of the admin performing the action
 * @param {Object} req - Express Request object
 * @returns {Promise<Object>} The deactivated user document
 */
const softDeleteUser = async (id, adminId, req) => {
  const user = await User.findById(id);
  if (!user) throw new ErrorResponse("User not found", 404);

  // Capture old state for audit
  const oldValue = {
    isActive: user.isActive ?? true,
    deletedAt: user.deletedAt || null,
  };

  // Turn off the user
  user.isActive = false;
  user.deletedAt = Date.now();
  await user.save();

  // Audit Log
  await auditService.log({
    action: "DELETE",
    entityType: "User",
    entityId: user._id,
    performedBy: adminId,
    req: req,
    oldValue: oldValue,
    newValue: { isActive: false, deletedAt: user.deletedAt },
  });

  return user;
};

/**
 * Updates a user's role or permissions with security hierarchy checks
 * @param {string} userId - The target user's ID to be updated
 * @param {Object} updateData - { roleId, customPermissions, deniedPermissions }
 * @param {Object} adminUser - The full User object of the admin performing the action (req.user)
 * @param {Object} req - Express Request object for Audit Log
 * @returns {Promise<Object>} The updated user document
 * @throws {ErrorResponse} 403 if trying to edit a higher-ranking admin
 */
const updateUserRoleById = async (userId, updateData, adminUser, req) => {
  const targetUser = await User.findById(userId).populate("role");
  if (!targetUser) {
    throw new ErrorResponse("User not found", 404);
  }

  // 1. Capture snapshot BEFORE update
  // We use the fallback pattern here as well for safety
  const oldValue = {
    ...targetUser.toObject(),
    isActive: targetUser.isActive ?? true,
  };

  // 2. --- HIERARCHY SECURITY CHECKS ---
  const adminRoleName = adminUser.role?.name || "";
  const targetRoleName = targetUser.role?.name || "";

  if (adminRoleName !== ROLES.SUPER_ADMIN) {
    if (targetRoleName === ROLES.SUPER_ADMIN) {
      throw new ErrorResponse(
        "You are not authorized to modify a Super Admin",
        403
      );
    }

    if (targetRoleName === adminRoleName) {
      throw new ErrorResponse(
        "You cannot modify users with the same role level as yours",
        403
      );
    }

    if (updateData.roleId) {
      const newRole = await Role.findById(updateData.roleId);
      if (!newRole) throw new Error("Target role not found");
      if (newRole.name === ROLES.SUPER_ADMIN) {
        throw new ErrorResponse(
          "Only Super Admins can assign the Super Admin role",
          403
        );
      }
    }
  }

  // 3. --- PROCEED WITH UPDATES ---
  if (updateData.roleId) targetUser.role = updateData.roleId;
  if (updateData.customPermissions)
    targetUser.customPermissions = updateData.customPermissions;
  if (updateData.deniedPermissions)
    targetUser.deniedPermissions = updateData.deniedPermissions;
  if (updateData.name) targetUser.name = updateData.name;

  // Handle deactivation (Soft Delete) if passed in updateData
  if (updateData.isActive !== undefined) {
    targetUser.isActive = updateData.isActive;
    if (!updateData.isActive) targetUser.deletedAt = Date.now();
    else targetUser.deletedAt = null;
  }

  await targetUser.save();

  // 4. RECORD THE AUDIT LOG
  await auditService.log({
    action: "UPDATE",
    entityType: "User",
    entityId: targetUser._id,
    performedBy: adminUser._id,
    req: req,
    oldValue: oldValue,
    newValue: targetUser.toObject(),
  });

  return targetUser;
};

export default {
  getAllUsers,
  updateUserRoleById,
  softDeleteUser,
};
