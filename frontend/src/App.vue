<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import DefaultLayout from "./layouts/DefaultLayout.vue";
import AdminLayout from "./layouts/AdminLayout.vue";
import AuthLayout from "./layouts/AuthLayout.vue";

const route = useRoute();

const layout = computed(() => {
  if (route.meta.layout === "admin") return AdminLayout;
  if (route.meta.layout === "auth") return AuthLayout;
  return DefaultLayout; // Fallback for everything else
});
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
