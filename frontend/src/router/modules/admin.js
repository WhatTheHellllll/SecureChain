export default [
  {
    path: "/admin/roles/",
    name: "admin-roles",
    component: () => import("@/views/admin/RoleManagementView.vue"),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      layout: "admin",
      // In the future, you can add this to strict check:
      // permissions: ['role.read']
    },
  },
  {
    path: "/admin/users/",
    name: "admin-users",
    component: () => import("@/views/admin/UserManagementView.vue"),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      layout: "admin",
      // In the future, you can add this to strict check:
      // permissions: ['role.read']
    },
  },
  {
    path: "/admin/audit-logs",
    name: "AuditLogs",
    component: () => import("@/views/admin/AuditLogView.vue"),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      layout: "admin",
    },
  },
];
