import { createRouter, createWebHistory } from "vue-router";
import authRoutes from "./modules/authentication";
import productRoutes from "./modules/product";
import adminRoutes from "./modules/admin";
import { PERMISSION_GROUPS } from "@backend/constants/permissions.js";
import { useAuthStore } from "../store/authStore";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  ...authRoutes,
  ...productRoutes,
  ...adminRoutes,

  {
    path: "/:pathMatch(.*)*",
    redirect: "/products/list",
  },
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// THE SECURITY GUARD
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // General Auth Protection
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next("/login");
  }

  // Admin Route Protection
  if (to.meta.requiresAdmin) {
    const role = authStore.user?.role || "viewer";
    const isSuperAdmin = role.name === PERMISSION_GROUPS.ADMIN.SUPER_ADMIN;
    const isSubAdmin = role.name === PERMISSION_GROUPS.ADMIN.SUB_ADMIN;
    // If no user OR user is not super_admin
    if (!role || (!isSuperAdmin && !isSubAdmin)) {
      return next("/products/list");
    }
  }

  const publicPages = ["/login", "/register"];
  const authRequired = !publicPages.includes(to.path);
  // if page is private AND user has no token -> Kick them to login
  if (authRequired && !authStore.token) {
    return next("/login");
  } else if (
    (to.name === "login" || to.name === "register") &&
    authStore.token
  ) {
    next("/products/list");
  } else {
    next();
  }
});

export default router;
