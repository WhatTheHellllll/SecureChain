import User from "../models/user.model.js";
import ErrorResponse from "../utils/error.response.js";

// @desc    Update User Role & Permissions
export const updateUserPermissions = async (req, res, next) => {
  try {
    const { roleId, customPermissions, deniedPermissions } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    // Update fields if provided
    if (roleId) user.role = roleId;
    if (customPermissions) user.customPermissions = customPermissions;
    if (deniedPermissions) user.deniedPermissions = deniedPermissions;

    await user.save();

    res.status(200).json({ 
        success: true,
        message: "User permissions updated",
        data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (for the Dashboard list)
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate('role');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};