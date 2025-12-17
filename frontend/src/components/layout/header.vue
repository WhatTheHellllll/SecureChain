<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <nav class="bg-slate-800 text-white p-4 shadow-md">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-xl font-bold">⛓️ SecureChain</h1>
      <div class="space-x-4">
        <RouterLink to="/products" class="hover:text-blue-400 transition">Products</RouterLink>
        <RouterLink to="/users" class="hover:text-blue-400 transition">Users</RouterLink>
        <button class="hover:text-red-400 transition">Logout</button>
      </div>
    </div>
  </nav>
</template>