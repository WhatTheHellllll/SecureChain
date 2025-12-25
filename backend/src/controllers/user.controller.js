import userService from "../services/user.service.js";

/**
 * @desc    Get all users (filtered by hierarchy)
 * @route   GET /api/v1/users
 * @access  Private (Admin)
 * @param   {import("express").Request} req
 * @param   {import("express").Response} res
 * @param   {import("express").NextFunction} next
 */
const getUsers = async (req, res, next) => {
  try {
    // We pass req.user so the service can filter out higher-ranking admins
    const users = await userService.getAllUsers(req.user);
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a user's Role or Permissions
 * @route   PUT /api/v1/users/update/:id
 * @access  Private (Sub-Admin+)
 * @param   {import("express").Request} req
 * @param   {import("express").Response} res
 * @param   {import("express").NextFunction} next
 */
const assignRolePermissions = async (req, res, next) => {
  try {
    // Pass: TargetID, Data, AdminUser (for security checks), Req (for Audit)
    const user = await userService.updateUserRoleById(
      req.params.id,
      req.body,
      req.user,
      req
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

/**
 * @desc    Soft delete (deactivate) a user
 * @route   DELETE /api/v1/users/delete/:id
 * @access  Private (Sub-Admin+)
 * @param   {import("express").Request} req
 * @param   {import("express").Response} res
 * @param   {import("express").NextFunction} next
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    await userService.softDeleteUser(id, req.user._id, req);

    res.status(200).json({
      success: true,
      message: "User deactivated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { getUsers, assignRolePermissions, deleteUser };
