<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router"; // useRoute gets the ID from URL
import productService from "../../services/productService.js";
import { showError, showSuccess } from "../../utils/alert.js";

const router = useRouter();
const route = useRoute(); // Access URL params

const form = ref({ name: "", sku: "", category: "", price: 0, quantity: 0 });
const loading = ref(true);
const saving = ref(false);
const error = ref(null);

// 1. Load Data on Mount
onMounted(async () => {
  try {
    const productId = route.params.id; // Get ID from URL /products/edit/:id
    const response = await productService.getProduct(productId);
    form.value = response.data.data; // Fill the form
  } catch (err) {
    error.value = "Failed to load product details.";
    console.error(err);
  } finally {
    loading.value = false;
  }
});

// 2. Handle Update
const handleUpdate = async () => {
  saving.value = true;
  try {
    const productId = route.params.id;
    await productService.update(productId, form.value);

    await showSuccess("Product has been updated successfully.");

    router.push("/products"); // Redirect to list
  } catch (err) {
    const message = err.response?.data?.message || "Failed to create product.";

    showError(message);
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Edit Product</h2>

    <div v-if="loading" class="text-gray-500">Loading details...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <form v-else @submit.prevent="handleUpdate" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700"
          >Product Name</label
        >
        <input v-model="form.name" type="text" required class="input-field" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">SKU</label>
          <input v-model="form.sku" type="text" required class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Category</label
          >
          <input
            v-model="form.category"
            type="text"
            required
            class="input-field"
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
            class="input-field"
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
            class="input-field"
          />
        </div>
      </div>

      <div class="flex justify-end space-x-3 pt-4">
        <RouterLink to="/products" class="btn-secondary">Cancel</RouterLink>
        <button type="submit" :disabled="saving" class="btn-primary">
          {{ saving ? "Updating..." : "Update Product" }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Quick Utility Classes for clean code */
.input-field {
  @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border;
}

.btn-primary {
  @apply px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition;
}

.btn-secondary {
  @apply px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition;
}
</style>
