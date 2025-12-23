/**
 * System Roles
 * These are the hardcoded roles the application logic depends on.
 */
export const ROLES = {
  SUPER_ADMIN: "super_admin", // Full system access bypass
  SUB_ADMIN: "sub_admin", // Standard administrator
  USER: "user", // Regular customer/user
};

/**
 * For Validation (Mongoose/Joi)
 * A flat array of valid role strings
 */
export const VALID_ROLES = Object.values(ROLES);
