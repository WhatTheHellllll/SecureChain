import userService from "../services/user.service.js";

/**
 * @desc    Get all users (for the Dashboard list)
 * @route   GET /api/v1/users
 * @access  Private (Admin)
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers(req.user);
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a user's Role or Permissions
 * @route   PUT /api/v1/users/:id
 * @access  Private (Admin)
 * @param   {string} req.params.id - The User ID to update
 * @param   {string} [req.body.role] - The new Role ID or name
 * @param   {string[]} [req.body.permissions] - Optional array of extra permissions
 */
const assignRolePermissions = async (req, res, next) => {
  try {
    // Pass the target ID, the new data, AND the person making the request
    const user = await userService.updateUserRoleById(
      req.params.id,
      req.body,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export { getUsers, assignRolePermissions };
