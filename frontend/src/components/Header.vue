<script setup>
import { RouterLink, useRouter } from "vue-router";
import { computed } from "vue";
import { ROLES } from "@backend/constants/roles";
import { useAuthStore } from "@/store/authStore";
const router = useRouter();

const authStore = useAuthStore();

const currentUser = computed(() => authStore.user);

const handleLogout = () => {
  // 1. Delete the keys
  authStore.logout();
  // 2. Go to login
  router.push("/login");
};
</script>

<template>
  <nav class="bg-slate-800 text-white p-4 shadow-md">
    <div class="container mx-auto flex justify-between items-center">
      <RouterLink
        to="/products/list"
        class="text-xl font-bold flex items-center gap-2"
      >
        SecureChain
      </RouterLink>

      <div class="flex items-center space-x-6">
        <div class="h-6 w-px bg-slate-600"></div>

        <router-link
          v-if="
            currentUser?.role === ROLES.SUPER_ADMIN ||
            currentUser?.role === ROLES.SUB_ADMIN
          "
          to="/admin/users"
          class="text-sm font-bold flex items-center gap-2 hover:text-blue-400 transition"
        >
          Manage Users
        </router-link>

        <router-link
          v-if="
            currentUser?.role === ROLES.SUPER_ADMIN ||
            currentUser?.role === ROLES.SUB_ADMIN
          "
          to="/admin/roles"
          class="text-sm font-bold flex items-center gap-2 hover:text-blue-400 transition"
        >
          Manage Roles
        </router-link>

        <button
          @click="handleLogout"
          class="text-sm bg-transparent border border-transparent hover:bg-slate-700 px-3 py-1 rounded transition"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>
