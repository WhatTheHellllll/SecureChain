<script setup>
import { computed } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import { ROLES } from "@backend/constants/roles";
import BaseButton from "../components/base/BaseButton.vue";
import {
  LogOut,
  Users,
  Shield,
  Package,
  LayoutDashboard,
} from "lucide-vue-next";

const router = useRouter();
const authStore = useAuthStore();
const currentUser = computed(() => authStore.user);

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<template>
  <nav class="bg-indigo-950 text-white shadow-lg z-50 relative">
    <div class="container mx-auto px-4 h-16 flex justify-between items-center">
      <RouterLink
        to="/products/list"
        class="text-xl font-bold flex items-center gap-2 hover:text-indigo-200 transition-colors"
      >
        <div class="p-1.5 bg-indigo-600 rounded-lg">
          <Package class="w-5 h-5 text-white" />
        </div>
        <span>SecureChain</span>
      </RouterLink>

      <div class="flex items-center space-x-2 md:space-x-4">
        <template
          v-if="
            currentUser?.role === ROLES.SUPER_ADMIN ||
            currentUser?.role === ROLES.SUB_ADMIN
          "
        >
          <router-link
            to="/admin/users"
            class="hidden md:flex items-center gap-2 text-sm font-medium text-indigo-200 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-indigo-900"
          >
            <Users class="w-4 h-4" />
            <span>Manage Users</span>
          </router-link>

          <router-link
            to="/admin/roles"
            class="hidden md:flex items-center gap-2 text-sm font-medium text-indigo-200 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-indigo-900"
          >
            <Shield class="w-4 h-4" />
            <span>Manage Roles</span>
          </router-link>

          <div class="h-6 w-px bg-indigo-800 mx-2 hidden md:block"></div>
        </template>

        <BaseButton
          variant="ghost"
          @click="handleLogout"
          class="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg text-red-300 hover:bg-red-900/20 hover:text-red-200 transition-colors"
        >
          <LogOut class="w-5 h-5" />
          <span class="font-medium">Logout</span>
        </BaseButton>
      </div>
    </div>
  </nav>
</template>
