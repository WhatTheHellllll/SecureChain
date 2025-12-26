import { createRouter, createWebHistory } from "vue-router";
import authRoutes from "./modules/authentication";
import productRoutes from "./modules/product";
import adminRoutes from "./modules/admin";
import { ROLES } from "@backend/constants/roles";
import { useAuthStore } from "../store/authStore";
import { computed } from "vue";
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
  const isAuthenticated = !!authStore.token;

  if ((to.name === "login" || to.name === "register") && isAuthenticated) {
    return next("/products/list");
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next("/login");
  }

  // Admin Route Protection
  if (to.meta.requiresAdmin) {
    const role = authStore.user?.role || "viewer";
    const isSuperAdmin = role.name === ROLES.SUPER_ADMIN;
    const isSubAdmin = role.name === ROLES.SUB_ADMIN;
    // If no user OR user is not super_admin
    if (!role || (!isSuperAdmin && !isSubAdmin)) {
      return next("/products/list");
    }
  }
  next();
});

export default router;
