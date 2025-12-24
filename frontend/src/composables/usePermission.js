import { computed } from "vue";
import { useAuthStore } from "../store/authStore";
import { ROLES } from "@backend/constants/roles.js";

export function usePermission() {
  const authStore = useAuthStore();

  // Get the current role safely
  const role = computed(() => {
    const rawRole = authStore.user?.role;
    // If it's an object, take .name. If it's a string, take it. Fallback to 'viewer'
    return rawRole?.name || rawRole || "viewer";
  });

  // Pre-calculate the final permission set
  // This runs ONLY when the user object changes, not every time 'can' is called.
  const effectivePermissions = computed(() => {
    const user = authStore.user;

    if (!user) return new Set();

    // Safely get role permissions (only if role is an object)
    const rolePerms = Array.isArray(user.role?.permissions)
      ? user.role.permissions.flat()
      : [];

    const customPerms = Array.isArray(user.customPermissions)
      ? user.customPermissions.flat()
      : [];

    // Use a Set for O(1) lookup speed (much faster than Array.includes)
    return new Set([...rolePerms, ...customPerms]);
  });

  // Check if user is Super Admin (God Mode)
  const isSuperAdmin = computed(() => role.value === ROLES.SUPER_ADMIN);

  // Check if user is ANY kind of Admin (Super or Sub)
  const isAdmin = computed(() =>
    [ROLES.SUB_ADMIN, ROLES.SUPER_ADMIN].includes(role.value)
  );

  // Generic Permission Checker (for future granular permissions)
  // Usage: can('product.create')
  const can = (permission) => {
    if (!authStore.user) return false;

    // Normalize input to prevent casing/whitespace bugs
    const perm = permission.trim();

    // Check Bans (Highest Priority)
    const denied = authStore.user.deniedPermissions || [];
    if (denied.includes(perm)) return false;

    // God Mode
    if (isSuperAdmin.value) return true;

    // Optimized Lookup (Using the Set we pre-calculated)
    return effectivePermissions.value.has(perm);
  };
  return {
    role,
    isSuperAdmin,
    isAdmin,
    can,
    allPermissions: effectivePermissions,
  };
}
