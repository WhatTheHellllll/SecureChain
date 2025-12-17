<script setup>
import Header from "./components/layout/header.vue";
import Footer from "./components/layout/footer.vue";
import ProductView from "./views/product.view.vue";
// Later, you will import UserView here too
import { ref } from "vue";

// Simple state to simulate switching pages (Until we add Router)
const currentPage = ref("products");
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans text-gray-900">
    <Header />

    <main class="flex-grow container mx-auto py-8">
      <RouterView />
    </main>

    <Footer />
  </div>
</template>
