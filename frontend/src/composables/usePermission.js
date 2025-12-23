import { computed } from "vue";
import { useAuthStore } from "../store/authStore";
import { ROLES } from "@backendRole/constants/roles.js";

export function usePermission() {
  const authStore = useAuthStore();

  // 1. Get the current role safely
  const role = computed(() => {
    const rawRole = authStore.user?.role;
    // If it's an object, take .name. If it's a string, take it. Fallback to 'viewer'
    return rawRole?.name || rawRole || "viewer";
  });
  // 2. Check if user is Super Admin (God Mode)
  const isSuperAdmin = computed(() => role.value === ROLES.SUPERADMIN);
  // 3. Check if user is ANY kind of Admin (Super or Sub)
  const isAdmin = computed(() =>
    ["super_admin", "sub_admin"].includes(role.value)
  );

  // 4. Generic Permission Checker (for future granular permissions)
  // Usage: can('product.create')
  const can = (permission) => {
    if (!authStore.user) return false;

    const denied = authStore.user.deniedPermissions || [];
    if (denied.includes(permission)) {
      return false;
    }

    if (isSuperAdmin.value) return true; // Super Admin can do everything

    // Get permissions from the ROLE object
    const rolePermissions = (authStore.user.role?.permissions || []).flat();

    // Get custom permissions from the USER object (if you have them)
    const customPermissions = (authStore.user.customPermissions || []).flat();

    // Combine them
    const allPermissions = [...rolePermissions, ...customPermissions];
    // Check if the permission exists
    return allPermissions.includes(permission);
  };

  return {
    role,
    isSuperAdmin,
    isAdmin,
    can,
  };
}
