<script setup>
import Header from "./components/layout/header.vue";
import Footer from "./components/layout/footer.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans text-gray-900">
    <Header v-if="!['/login', '/register'].includes(route.path)" />

    <main class="flex-grow container mx-auto py-8">
      <RouterView />
    </main>

    <Footer v-if="!['/login', '/register'].includes(route.path)" />
  </div>
</template>
