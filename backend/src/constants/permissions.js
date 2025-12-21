const PERMISSION_GROUPS = {
  // Group 1: Products
  PRODUCT: {
    READ: "product.read",
    CREATE: "product.create",
    UPDATE: "product.update",
    DELETE: "product.delete"
  },
  
  // Group 2: Users
  USER: {
    READ: "user.read",
    CREATE: "user.create",
    UPDATE: "user.update",
    DELETE: "user.delete", // (e.g., Ban user)
    MANAGE_PERMISSIONS: "user.manage_permissions"
  },

  // Group 3: Roles
  ROLE: {
    READ: "role.read",
    MANAGE: "role.manage"
  },

  ADMIN: {
    ALL: "*"
  }
};

// Helper: Flatten them for validation (Mongoose needs a flat list)
const VALID_PERMISSIONS = Object.values(PERMISSION_GROUPS)
  .map((group) => Object.values(group))
  .flat();

export { PERMISSION_GROUPS, VALID_PERMISSIONS };