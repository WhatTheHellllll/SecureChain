import { Role } from '../models/role.model.js';
import ErrorResponse from '../utils/error.response.js';
import { PERMISSION_GROUPS } from '../constants/permissions.js';

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
  return await Role.find();
};

/**
 * Create a new role
 * @param {Object} roleData - { name, description, permissions }
 */
const createRole = async (roleData) => {
  const role = await Role.create(roleData);
  return role;
};

/**
 * Update a role by ID
 * @param {String} id
 * @param {Object} updateData
 */
const updateRoleById = async (id, updateData) => {
  const role = await Role.findById(id);

  if (!role) {
    throw new ErrorResponse('Role not found', 404);
  }

  // Update fields if they exist in the updateData
  role.name = updateData.name || role.name;
  role.description = updateData.description || role.description;

  if (updateData.permissions) {
    role.permissions = updateData.permissions;
  }

  await role.save();
  return role;
};

/**
 * Delete a role by ID
 * @param {String} id
 */
const deleteRoleById = async (id) => {
  const role = await Role.findById(id);

  if (!role) {
    throw new ErrorResponse('Role not found', 404);
  }

  // Business Logic: Prevent deleting Super Admin
  // (Ideally, use a constant for 'super_admin' or check against a flag in the DB)
  if (role.name === 'Super_Admin' || role.name === 'super_admin') {
    throw new ErrorResponse('Cannot delete Super Admin role', 400);
  }

  await role.deleteOne();
  return true;
};

export default {
  getPermissionList,
  getAllRoles,
  createRole,
  updateRoleById,
  deleteRoleById,
};
