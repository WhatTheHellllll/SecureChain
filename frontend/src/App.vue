<script setup>
import Header from "./components/layout/header.vue";
import Footer from "./components/layout/footer.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans text-gray-900">
    <Header v-if="!route.meta.hideLayout" />

    <main class="flex-grow container mx-auto">
      <RouterView />
    </main>

    <Footer v-if="!route.meta.hideLayout" />
  </div>
</template>
