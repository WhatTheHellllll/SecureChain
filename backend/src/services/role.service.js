import { Role } from "../models/role.model.js";
import ErrorResponse from "../utils/error.response.js";
import { PERMISSION_GROUPS } from "../constants/permissions.js";
import { ROLES } from "../constants/roles.js";
import auditService from "../services/audit.service.js";
/**
 * Get the static list of permissions
 */
const getPermissionList = () => {
  return PERMISSION_GROUPS;
};

/**
 * Fetch all roles from DB
 */
const getAllRoles = async () => {
  return await Role.find({ isActive: { $ne: false } });
};

/**
 * Creates a new role with specific permissions
 * @param {Object} roleData - { name, description, permissions[] }
 * @param {string} userId - Admin ID creating the role
 * @param {Object} req - Express Request object for Audit Log
 * @returns {Promise<Object>} The new role document
 */
const createRole = async (roleData) => {
  const role = await Role.create(roleData);
  await auditService.log({
    action: "CREATE",
    entityType: "Role",
    entityId: role._id,
    performedBy: userId,
    req: req,
    oldValue: null,
    newValue: role.toObject(),
  });
  return role;
};

/**
 * Updates an existing role's details or permissions
 * @param {string} id - Role ID
 * @param {Object} updateData - Fields to update
 * @param {string} userId - Admin ID performing update
 * @param {Object} req - Express Request object
 * @returns {Promise<Object>} Updated role
 */
const updateRoleById = async (id, updateData) => {
  const role = await Role.findById(id);

  if (!role) {
    throw new ErrorResponse("Role not found", 404);
  }
  const oldValue = role.toObject();
  // Update fields if they exist in the updateData
  role.name = updateData.name || role.name;
  role.description = updateData.description || role.description;

  if (updateData.permissions) {
    role.permissions = updateData.permissions;
  }

  await role.save();

  await auditService.log({
    action: "UPDATE",
    entityType: "Role",
    entityId: role._id,
    performedBy: user._id,
    req: req,
    oldValue: oldValue,
    newValue: role.toObject(),
  });
  return role;
};

/**
 * Soft deletes a role to prevent future assignment
 * @note Prevents deletion of SUPER_ADMIN role
 * @param {string} id - Role ID to deactivate
 * @param {string} userId - Admin ID performing delete
 * @param {Object} req - Express Request object
 * @returns {Promise<Object>} The deactivated role
 */
const softDeleteRole = async (id, userId, req) => {
  const role = await Role.findById(id);

  if (!role) {
    throw new ErrorResponse("Role not found", 404);
  }

  // 1. Critical Guard: Prevent deleting Super Admin
  if (role.name === ROLES.SUPER_ADMIN) {
    throw new ErrorResponse(
      "The Super Admin role is protected and cannot be deleted",
      400
    );
  }

  // Capture old state for the audit log
  const oldValue = {
    isActive: role.isActive ?? true, // Fallback if field wasn't there before
    deletedAt: role.deletedAt || null,
  };

  // 3. Perform the Soft Delete
  role.isActive = false;
  role.deletedAt = Date.now();

  await role.save();

  // 4. RECORD THE AUDIT LOG
  await auditService.log({
    action: "DELETE",
    entityType: "Role",
    entityId: role._id,
    performedBy: userId,
    oldValue: oldValue,
    newValue: { isActive: false, deletedAt: role.deletedAt },
    req: req,
  });

  return role;
};

export default {
  getPermissionList,
  getAllRoles,
  createRole,
  updateRoleById,
  softDeleteRole,
};
