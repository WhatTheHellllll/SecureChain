export default [
  {
    // ===========================================
    // PUBLIC / STAFF (Header & Footer)
    // ===========================================
    path: "/products/list",
    name: "public-products-list",
    component: () => import("@/views/products/ProductView.vue"),
    meta: {
      layout: "default", // 👈 Customers see Header
      requiresAuth: true, // Or true if they need to be logged in customers
    },
  },
  {
    path: "/products/create",
    name: "public-product-create",
    component: () => import("@/views/products/ProductCreate.vue"),
    meta: { requiresAuth: true, layout: "default" },
  },
  {
    path: "/products/edit/:id",
    name: "public-product-edit",
    component: () => import("@/views/products/ProductEdit.vue"),
    meta: {
      layout: "default",
      requiresAuth: true,
    },
    // 3. SECURITY: This is where we actually check permissions!
  },

  // ===========================================
  // ADMIN (Sidebar)
  // ===========================================
  {
    path: "/admin/products/list",
    name: "admin-products-list",
    component: () => import("@/views/products/ProductView.vue"),
    meta: { layout: "admin", requiresAuth: true },
  },
  {
    path: "/admin/products/edit/:id",
    name: "admin-product-edit", // <--- Unique Name
    component: () => import("@/views/products/ProductEdit.vue"),
    meta: { layout: "admin", requiresAuth: true },
  },
  {
    path: "/admin/products/create",
    name: "admin-product-create",
    component: () => import("@/views/products/ProductCreate.vue"),
    meta: { layout: "admin", requiresAuth: true },
  },
];
