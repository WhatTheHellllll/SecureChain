<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import productService from "../../services/productService.js";
import { showError, showSuccess } from "../../utils/alert.js";

const router = useRouter();
const route = useRoute();

const isAdminMode = computed(() => route.path.startsWith("/admin"));

const productRouteName = computed(() =>
  isAdminMode.value ? "admin-products-list" : "public-products-list"
);
const form = ref({ name: "", sku: "", category: "", price: 0, quantity: 0 });
const error = ref(null);
const loading = ref(false);

const handleSubmit = async () => {
  loading.value = true;
  try {
    await productService.create(form.value);

    await showSuccess("Product has been created successfully.");

    router.push({ name: productRouteName.value });
  } catch (err) {
    console.error(err);
    const message = err.response?.data?.message || "Failed to create product.";

    showError(message);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700"
          >Product Name</label
        >
        <input
          v-model="form.name"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          placeholder="e.g. Wireless Mouse"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">SKU</label>
          <input
            v-model="form.sku"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            placeholder="e.g. WM-001"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Category</label
          >
          <input
            v-model="form.category"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            placeholder="e.g. Electronics"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Price ($)</label
          >
          <input
            v-model="form.price"
            type="number"
            step="0.01"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Quantity</label
          >
          <input
            v-model="form.quantity"
            type="number"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>
      </div>

      <div class="flex justify-end space-x-3 pt-4">
        <RouterLink
          :to="{ name: productRouteName }"
          class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </RouterLink>
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {{ loading ? "Saving..." : "Save Product" }}
        </button>
      </div>
    </form>
  </div>
</template>
