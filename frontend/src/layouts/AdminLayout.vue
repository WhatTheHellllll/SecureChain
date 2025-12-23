<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/authStore";
import { usePermission } from "../composables/usePermission";

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
    show: isSuperAdmin.value, // <-- ONLY SUPER ADMIN
  },
  {
    label: "Manage Users",
    path: "/admin/users",
    show: isAdmin.value || isSuperAdmin.value, // <-- ADMINS Only
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
  <div class="flex h-screen bg-gray-100">
    <aside class="w-64 bg-slate-800 text-white flex flex-col">
      <div class="p-4 text-xl font-bold border-b border-slate-700">
        SecureChain Admin
      </div>

      <nav class="flex-1 p-4 space-y-2">
        <template v-for="item in menuItems" :key="item.path">
          <RouterLink
            v-if="item.show"
            :to="item.path"
            class="block px-4 py-2 rounded hover:bg-slate-700 transition"
            active-class="bg-blue-600 text-white"
          >
            {{ item.label }}
          </RouterLink>
        </template>
      </nav>

      <div class="p-4 border-t border-slate-700">
        <button
          @click="handleLogout"
          class="w-full text-left px-4 py-2 text-red-400 hover:text-red-300"
        >
          Logout
        </button>
      </div>
    </aside>

    <main class="flex-1 overflow-auto p-8">
      <slot />
    </main>
  </div>
</template>
