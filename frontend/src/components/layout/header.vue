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
        <div class="h-6 w-px bg-slate-600"></div>

        <button
          @click="handleLogout"
          class="text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none""
        >
          Logout
        </button>
        
      </div>
    </div>
  </nav>
</template>
