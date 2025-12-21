import {Role} from "../models/role.model.js";
import ErrorResponse from "../utils/error.response.js";
import { PERMISSION_GROUPS } from "../constants/permissions.js";

// @desc    Get system configuration (permissions list)
const getPermissions = (req, res, next) => {
  // send the entire object directly to the frontend
  res.status(200).json({
    success: true,
    data: PERMISSION_GROUPS
  });
};

// @desc    Get all roles
const getRoles = async (req, res, next) => {
  try {
    const roles = await Role.find();
    res.status(200).json({ 
        success: true, 
        count: roles.length,
        data: roles });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new role
const createRole = async (req, res, next) => {
  try {
    const { name, description, permissions } = req.body;

    const role = await Role.create({
      name,
      description,
      permissions // Expecting an array like ["product.create", "product.read"]
    });
    res.status(201).json({ 
        success: true,
        message: "Role created",
        data: role });
  } catch (error) {
    next(error);
  }
};

// @desc    Update permissions for a role
const updateRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return next(new ErrorResponse("Role not found", 404));
    }

    role.name = req.body.name || role.name;
    role.description = req.body.description || role.description;  

    if (req.body.permissions) {
      role.permissions = req.body.permissions;
    }

    await role.save();
    
    res.status(200).json({ 
        success: true, 
        message: "Role updated",
        data: role });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a role
const deleteRole = async (req, res, next) => {
  try {
    // Prevent deleting the Super Admin role
    const role = await Role.findById(req.params.id);
    if (role.name === 'super_admin') {
      return next(new ErrorResponse("Cannot delete Super Admin role", 400));
    }

    await role.deleteOne();
    res.status(200).json({ 
        success: true, 
        message: "Role deleted" });
  } catch (error) {
    next(error);
  }
};

export { getRoles, createRole, updateRole, deleteRole, getPermissions };

