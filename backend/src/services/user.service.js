import { User } from "../models/user.model.js";
import ErrorResponse from "../utils/error.response.js";

/**
 * Get all users with their role details
 */
const getAllUsers = async () => {
  return await User.find().populate("role");
};

/**
 * Update user details (Role, Permissions, or Profile info)
 * @param {String} userId
 * @param {Object} updateData
 */
const updateUserRoleById = async (userId, updateData) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }

  if (updateData.roleId) {
    user.role = updateData.roleId;
  }

  if (updateData.customPermissions) {
    user.permissions = updateData.customPermissions;
  }

  if (updateData.deniedPermissions) {
    user.deniedPermissions = updateData.deniedPermissions;
  }

  if (updateData.name) {
    user.name = updateData.name;
  }

  await user.save();
  return user;
};

export default {
  getAllUsers,
  updateUserRoleById,
};
