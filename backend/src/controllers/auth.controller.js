import authService from '../services/auth.service.js';


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

    res.status(200).json({
      success: true,
      token: data.token,
      user: data.user,
    });
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
    // Call Service
    const data = await authService.registerUser(req.body);

    // Send Response
    res.status(201).json({
      success: true,
      token: data.token,
      user: data.user,
    });
  } catch (error) {
    next(error);
  }
};

export { login, register };
