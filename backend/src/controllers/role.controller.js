import roleService from '../services/role.service.js';

/**
 * @desc    Get system configuration (list of all available permissions)
 * @route   GET /api/v1/roles/permissions
 * @access  Private (Admin)
 */
const getPermissions = (req, res, next) => {
  try {
    const data = roleService.getPermissionList();
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all roles
 * @route   GET /api/v1/roles
 * @access  Private (Admin)
 */
const getRoles = async (req, res, next) => {
  try {
    const roles = await roleService.getAllRoles();

    res.status(200).json({
      success: true,
      count: roles.length,
      data: roles,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new role
 * @route   POST /api/v1/roles
 * @access  Private (Admin)
 * @param   {string} req.body.name - Name of the role (e.g., "Manager")
 * @param   {string[]} req.body.permissions - Array of permission strings
 */
const createRole = async (req, res, next) => {
  try {
    // The service handles the database creation
    const role = await roleService.createRole(req.body);

    res.status(201).json({
      success: true,
      message: 'Role created',
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update permissions or details for a role
 * @route   PUT /api/v1/roles/:id
 * @access  Private (Admin)
 * @param   {string} req.params.id - The Role ID
 * @param   {Object} req.body - Fields to update (name, permissions, etc.)
 */
const updateRole = async (req, res, next) => {
  try {
    const role = await roleService.updateRoleById(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Role updated',
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a role
 * @route   DELETE /api/v1/roles/:id
 * @access  Private (Admin)
 * @param   {string} req.params.id - The Role ID
 */
const deleteRole = async (req, res, next) => {
  try {
    await roleService.deleteRoleById(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Role deleted',
    });
  } catch (error) {
    next(error);
  }
};

export { getPermissions, getRoles, createRole, updateRole, deleteRole };
