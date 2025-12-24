const PERMISSION_GROUPS = {
  // Group 1: Products
  PRODUCT: {
    READ: "product.read",
    CREATE: "product.create",
    UPDATE: "product.update",
    DELETE: "product.delete",
  },

  // Group 2: Users
  USER: {
    READ: "user.read",
    UPDATE: "user.update",
    MANAGE_PERMISSIONS: "user.manage_permissions",
  },

  // Group 3: Roles
  ROLE: {
    MANAGE: "role.manage",
    READ: "role.read",
    DELETE: "role.delete",
    CREATE: "role.create",
    UPDATE: "role.update",
  },
  ADMIN: {
    SUPER_ADMIN: "*",
    SUB_ADMIN: "sub_admin",
  },
};

// Helper: Flatten them for validation (Mongoose needs a flat list)
const VALID_PERMISSIONS = Object.values(PERMISSION_GROUPS)
  .map((group) => Object.values(group))
  .flat();

export { PERMISSION_GROUPS, VALID_PERMISSIONS };
