<script setup>
import { RouterLink, useRouter } from "vue-router";
import { ref, onMounted } from 'vue';

const router = useRouter();

const currentUser = ref(null);

onMounted(() => {
  // 1. Get the string from storage
  const userSession = sessionStorage.getItem('user');

  // 2. Turn it back into an Object (if it exists)
  if (userSession) {
    currentUser.value = JSON.parse(userSession);
  }
});

const handleLogout = () => {
  // 1. Delete the keys
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');

  // 2. Go to login
  router.push("/login");
};
</script>

<template>
  <nav class="bg-slate-800 text-white p-4 shadow-md">
    <div class="container mx-auto flex justify-between items-center">

      <RouterLink to="/products/list" class="text-xl font-bold flex items-center gap-2">
        SecureChain
      </RouterLink>

      <div class="flex items-center space-x-6">
        <div class="h-6 w-px bg-slate-600"></div>

        <router-link v-if="currentUser?.role === 'super_admin'" to="/admin/users"
          class="text-sm font-bold flex items-center gap-2 hover:text-blue-400 transition">
          Manage User
        </router-link>

        <router-link v-if="currentUser?.role === 'super_admin'" to="/admin/roles"
          class="text-sm font-bold flex items-center gap-2 hover:text-blue-400 transition">
          Manage Roles
        </router-link>

        <button @click="handleLogout"
          class="text-sm bg-transparent border border-transparent hover:bg-slate-700 px-3 py-1 rounded transition">
          Logout
        </button>
      </div>

    </div>
  </nav>
</template>
