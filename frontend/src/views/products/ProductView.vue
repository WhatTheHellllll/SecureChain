<script setup>
import { ref, onMounted, computed } from "vue";
import productService from "../../services/productService.js";
import { RouterLink } from "vue-router";
import { confirmDelete, showSuccess } from "../../utils/alert.js";

const products = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref("");

const fetchProducts = async () => {
  try {
    const response = await productService.getAllProduct();
    products.value = response.data.data || response.data;
    loading.value = false;
  } catch (err) {
    error.value = "Failed to load inventory.";
    loading.value = false;
  }
};

const handleDelete = async (id) => {
  if (await confirmDelete()) {
    await productService.delete(id);
    products.value = products.value.filter((p) => p._id !== id);

    showSuccess("Product deleted successfully!");
  }
};

// Search Logic (Computed)
const filteredProducts = computed(() => {
  // If search is empty, return everything
  if (!searchQuery.value) return products.value;

  // Otherwise, filter by Name OR SKU (Case insensitive)
  const lowerQuery = searchQuery.value.toLowerCase();
  return products.value.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.sku.toLowerCase().includes(lowerQuery)
  );
});


onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Product Management</h2>
      <RouterLink to="/products/create"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm">
        + Add Product
      </RouterLink>
    </div>

    <div class="mb-4">
      <div class="relative">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          🔍
        </span>
        <input v-model="searchQuery" type="text" placeholder="Search by Name or SKU..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
      </div>
    </div>

    <div v-if="error" class="bg-red-100 text-red-700 p-4 rounded mb-4">
      {{ error }}
    </div>
    <div v-if="loading" class="text-center py-10 text-gray-500">Loading...</div>

    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <div class="max-h-[600px] overflow-y-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Modifier
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in filteredProducts" :key="product._id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ product.name }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                {{ product.sku }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {{ product.category }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                ${{ product.price }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="product.quantity < 5
                  ? 'text-red-600 font-bold'
                  : 'text-gray-900'
                  ">
                  {{ product.quantity }}
                </span>
              </td>
              <td class="p-4">
                <div v-if="product.lastUpdatedBy" class="flex flex-col">
                  <span class="text-sm font-medium text-gray-900">
                    {{ product.lastUpdatedBy.name }}
                  </span>
                  <span class="text-xs text-gray-500">
                    {{ product.lastUpdatedBy.email }}
                  </span>
                </div>
                <div v-else class="text-xs text-gray-400 italic">
                  System Initialized
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-left text-sm font-medium space-x-3">
                <RouterLink :to="`/products/edit/${product._id}`"
                  class="text-indigo-600 hover:text-indigo-900 font-bold">
                  Edit
                </RouterLink>

                <button @click="handleDelete(product._id)" class="text-red-600 hover:text-red-900 font-bold">
                  Delete
                </button>
              </td>
            </tr>

            <tr v-if="filteredProducts.length === 0">
              <td colspan="5" class="px-6 py-10 text-center text-gray-500">
                No products found matching "{{ searchQuery }}"
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
