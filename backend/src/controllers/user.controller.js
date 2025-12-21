import { User } from '../models/user.model.js';
import ErrorResponse from '../utils/error.response.js';

// @desc    Update User Role & Permissions
const assignRolePermissions = async (req, res, next) => {
  try {
    const { roleId, customPermissions, deniedPermissions } = req.body;

    // 1. Find the User (Not the Role!)
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // 2. Update the User's "ID Badge"
    // (Changing who they are)
    if (roleId) user.role = roleId;

    // 3. Handle Special Exceptions (Optional but powerful)
    // "customPermissions" = Extra powers added on top of the role
    // "deniedPermissions" = Powers removed from the role
    if (customPermissions) user.customPermissions = customPermissions;
    if (deniedPermissions) user.deniedPermissions = deniedPermissions;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User permissions updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Get all users (for the Dashboard list)
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate('role');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export { getUsers, assignRolePermissions };
// have not implement update user's name yet because the name property in user model is not a required field
