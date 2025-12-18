<script setup>
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();

const handleLogout = () => {
  // 1. Delete the keys
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // 2. Go to login
  router.push("/login");
};
</script>

<template>
  <nav class="bg-slate-800 text-white p-4 shadow-md">
    <div class="container mx-auto flex justify-between items-center">
      <RouterLink to="/" class="text-xl font-bold flex items-center gap-2">
        ⛓️ SecureChain
      </RouterLink>

      <div class="flex items-center space-x-6">
        <RouterLink to="/products" class="hover:text-blue-400 transition">
          Products
        </RouterLink>

        <RouterLink to="/users" class="hover:text-blue-400 transition">
          Users
        </RouterLink>

        <div class="h-6 w-px bg-slate-600"></div>

        <button
          @click="handleLogout"
          class="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow-sm"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>
