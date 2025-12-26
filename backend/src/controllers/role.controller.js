import roleService from "../services/role.service.js";

/**
 * @desc    Get system configuration (list of all available permissions)
 * @route   GET /api/v1/roles/permissions
 * @access  Private (Admin)
 * @param   {import("express").Request} req
 * @param   {import("express").Response} res
 * @param   {import("express").NextFunction} next
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
 * @param   {import("express").Request} req
 * @param   {import("express").Response} res
 * @param   {import("express").NextFunction} next
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
 * @param   {import("express").Request} req
 * @param   {import("express").Response} res
 * @param   {import("express").NextFunction} next
 */
const createRole = async (req, res, next) => {
  try {
    // The service handles the database creation
    const role = await roleService.createRole(req.body);

    res.status(201).json({
      success: true,
      message: "Role created",
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
 * @param   {import("express").Request} req
 * @param   {import("express").Response} res
 * @param   {import("express").NextFunction} next
 */
const updateRole = async (req, res, next) => {
  try {
    const role = await roleService.updateRoleById(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Role updated",
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a role (Soft Delete)
 * @route   DELETE /api/v1/roles/:id
 * @access  Private (Admin)
 * @param   {import("express").Request} req
 * @param   {import("express").Response} res
 * @param   {import("express").NextFunction} next
 */
const deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params;

    // You MUST pass 3 arguments to match the new service signature
    await roleService.softDeleteRole(
      id, // Role ID
      req.user._id,
      req // The Request object for the Audit Log
    );

    res.status(200).json({
      success: true,
      message: "Role deleted",
    });
  } catch (error) {
    next(error);
  }
};

export { getPermissions, getRoles, createRole, updateRole, deleteRole };
