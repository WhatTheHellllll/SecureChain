<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/authStore";
import { usePermission } from "../composables/usePermission";
import {
  Package,
  ShieldAlert,
  Users,
  FileClock,
  LogOut,
  LayoutDashboard,
} from "lucide-vue-next";

const authStore = useAuthStore();
const router = useRouter();
const { isSuperAdmin, isAdmin } = usePermission();

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};

// Sidebar Links Configuration
const menuItems = computed(() => [
  {
    label: "Products",
    path: "/admin/products/list",
    show: true,
  },
  {
    label: "Manage Roles",
    path: "/admin/roles",
    show: isSuperAdmin.value || isAdmin.value,
  },
  {
    label: "Manage Users",
    path: "/admin/users",
    show: isSuperAdmin.value || isAdmin.value,
  },
  {
    label: "Activity Logs",
    path: "/admin/audit-logs",
    show: isSuperAdmin.value, // Usually only Super Admins see logs
  },
]);
</script>

<template>
  <!-- <div class="p-4 text-xs bg-slate-900 text-gray-300">
    <p>
      Current Role: {{ authStore.user?.role?.name || authStore.user?.role }}
    </p>
    <p>Is Admin? {{ authStore.isAdmin }}</p>
    <p>Is Super? {{ authStore.isSuperAdmin }}</p>
  </div> -->
  <div class="flex h-screen bg-gray-50">
    <aside
      class="w-64 bg-indigo-950 text-gray-100 flex flex-col shadow-xl z-10"
    >
      <div
        class="p-6 text-xl font-bold border-b border-indigo-900 flex items-center gap-3"
      >
        <div class="p-1.5 bg-indigo-600 rounded-lg">
          <LayoutDashboard class="w-5 h-5 text-white" />
        </div>
        <span class="tracking-tight">SecureChain</span>
      </div>

      <nav class="flex-1 p-4 space-y-1">
        <template v-for="item in menuItems" :key="item.path">
          <RouterLink
            v-if="item.show"
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group"
            :class="'hover:bg-indigo-900/50 hover:text-white'"
            active-class="bg-indigo-600 text-white shadow-md font-medium"
          >
            <component
              :is="item.icon"
              class="w-5 h-5 transition-colors"
              :class="
                $route.path.includes(item.path)
                  ? 'text-white'
                  : 'text-indigo-300 group-hover:text-white'
              "
            />

            <span>{{ item.label }}</span>
          </RouterLink>
        </template>
      </nav>

      <div class="p-4 border-t border-indigo-900">
        <button
          @click="handleLogout"
          class="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg text-red-300 hover:bg-red-900/20 hover:text-red-200 transition-colors"
        >
          <LogOut class="w-5 h-5" />
          <span class="font-medium">Logout</span>
        </button>
      </div>
    </aside>

    <main class="flex-1 overflow-auto bg-gray-50 p-8">
      <slot />
    </main>
  </div>
</template>
