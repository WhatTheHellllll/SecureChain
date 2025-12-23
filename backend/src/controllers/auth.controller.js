import authService from "../services/auth.service.js";

/**
 * @desc    Authenticate a user and return a JWT token
 * @route   POST /api/v1/auth/login
 * @access  Public
 * @param   {string} req.body.email - User's email address
 * @param   {string} req.body.password - User's password
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const data = await authService.loginUser(email, password);
    sendTokenResponse(data, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register a new user account
 * @route   POST /api/v1/auth/register
 * @access  Public
 * @param   {Object} req.body - User registration data (name, email, password)
 */
const register = async (req, res, next) => {
  try {
    // 1. Call Service (Returns populated User Document)
    const user = await authService.registerUser(req.body);

    // 2. Use the helper (Generates Token, Cookie, and Full Response)
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  res
    .status(statusCode)
    .cookie("token", token)
    .json({
      success: true,
      token,
      // This is the important part for your Frontend Store
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // <--- This will now contain the permissions array
        customPermissions: user.customPermissions,
        deniedPermissions: user.deniedPermissions,
      },
    });
};
export { login, register };
