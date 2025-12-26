<script setup>
import { ref, onMounted, computed } from "vue";
import productService from "../../services/productService.js";
import { useRoute, useRouter } from "vue-router";
import { confirmDelete, showSuccess } from "../../utils/alert.js";
import { Pencil, Trash2, PlusCircle, Search } from "lucide-vue-next";
import { usePermission } from "../../composables/usePermission.js";
import { PERMISSION_GROUPS } from "@backend/constants/permissions.js";
import BaseButton from "../../components/base/BaseButton.vue";
import BaseModal from "@/components/base/BaseModal.vue";

const isModalOpen = ref(false);
const router = useRouter();
const route = useRoute();
const products = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref("");
const { can } = usePermission();
const isAdminMode = computed(() => route.path.startsWith("/admin"));

// Dynamically choose which route name to use
const editRouteName = computed(() =>
  isAdminMode.value ? "admin-product-edit" : "public-product-edit"
);

const createRouteName = computed(() =>
  isAdminMode.value ? "admin-product-create" : "public-product-create"
);

const fetchProducts = async () => {
  try {
    const response = await productService.getAllProduct();
    products.value = response.data.data || response.data;
    loading.value = false;
  } catch (err) {
    console.log(error.message);
    error.value = "Failed to load inventory.";
    loading.value = false;
  }
};

const handleDelete = async (id) => {
  //#region
  // console.log("Role Permissions:", authStore.user.role?.permissions);
  // console.log("Custom Permissions:", authStore.user.customPermissions);
  // console.log("Checking against string:", PERMISSION_GROUPS.PRODUCT.DELETE);
  // // DEBUG LOGS - Open your browser console (F12) to see these
  // console.log("Checking permission for:", permissionRequired);
  // console.log("User has permission?", hasPermission);
  // console.log("Full User Data:", authStore.user);
  //#endregion
  const permissionRequired = PERMISSION_GROUPS.PRODUCT.DELETE;
  const hasPermission = can(permissionRequired);
  if (!hasPermission) {
    showError("Access Denied!");
    return; // This MUST stop the function
  }
  if (await confirmDelete()) {
    try {
      await productService.delete(id);

      // Remove it from the "Active" list in the UI
      products.value = products.value.filter((p) => p._id !== id);

      showSuccess("Product archived successfully!");
    } catch (error) {
      showError("Failed to archive product.");
    }
  }
};
const goToEdit = (id) => {
  router.push({ name: editRouteName.value, params: { id } });
};
const goToCreate = () => {
  router.push({ name: createRouteName.value });
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
  <!-- <div
    class="bg-slate-900 text-green-400 p-6 rounded-lg font-mono text-xs shadow-xl border border-slate-700 my-4"
  >
    <h3 class="text-white font-bold mb-2 border-b border-slate-700 pb-1">
      🔐 Auth & Permission Debugger
    </h3>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <p>
          <span class="text-slate-500">User:</span> {{ authStore.user?.email }}
        </p>
        <p>
          <span class="text-slate-500">Role:</span>
          <span class="text-yellow-400">{{ role }}</span>
        </p>
        <p>
          <span class="text-slate-500">Is Super?</span>
          {{ isSuperAdmin ? "✅ Yes" : "❌ No" }}
        </p>
      </div>

      <div>
        <p class="text-white font-semibold">Permission Stack Logic:</p>
        <p
          class="text-red-400"
          v-if="authStore.user?.deniedPermissions?.length"
        >
          🚫 Banned: {{ authStore.user.deniedPermissions }}
        </p>
        <p class="text-blue-400">
          📜 Effective List:
          {{ allPermissions ? [...allPermissions] : "Loading..." }}
        </p>
      </div>
    </div>

    <div class="mt-4 pt-2 border-t border-slate-700 flex gap-4">
      <span :class="can('product.update') ? 'text-green-400' : 'text-red-500'">
        Update: {{ can("product.update") ? "ALLOWED" : "DENIED" }}
      </span>
      <span :class="can('product.delete') ? 'text-green-400' : 'text-red-500'">
        Delete: {{ can("product.delete") ? "ALLOWED" : "DENIED" }}
      </span>
    </div>
  </div> -->
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Product Management</h2>
      <BaseButton
        variant="primary"
        :disabled="!can(PERMISSION_GROUPS.PRODUCT.CREATE)"
        @click="goToCreate()"
      >
        <template #icon>
          <PlusCircle class="h-5 w-5" />
        </template>
        Create Product
      </BaseButton>
    </div>

    <div class="mb-4">
      <div class="relative">
        <span
          class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"
        >
          <Search class="w-5 h-5" />
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by Name or SKU..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>
    </div>

    <div v-if="error" class="bg-red-100 text-red-700 p-4 rounded mb-4">
      {{ error }}
    </div>
    <div v-if="loading" class="text-center py-10 text-gray-500">Loading...</div>

    <div
      v-else
      class="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
    >
      <div
        class="max-h-[600px] overflow-y-auto overflow-x-auto custom-scrollbar"
      >
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                SKU
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Stock
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last Modifier
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="product in filteredProducts"
              :key="product._id"
              class="hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ product.name }}
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono"
              >
                {{ product.sku }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                >
                  {{ product.category }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                ${{ product.price }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="
                    product.quantity < 5
                      ? 'text-red-600 font-bold'
                      : 'text-gray-900'
                  "
                >
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
              <td
                class="px-6 py-4 whitespace-nowrap text-left text-sm font-medium"
              >
                <div class="flex items-center justify-start gap-2">
                  <BaseButton
                    variant="icon"
                    :disabled="!can(PERMISSION_GROUPS.PRODUCT.UPDATE)"
                    @click="goToEdit(product._id)"
                    title="Edit Product"
                    class="hover:text-blue-600 hover:bg-blue-50"
                  >
                    <template #icon><Pencil class="h-4 w-4" /></template>
                  </BaseButton>

                  <BaseButton
                    variant="icon"
                    :disabled="!can(PERMISSION_GROUPS.PRODUCT.DELETE)"
                    @click="handleDelete(product._id)"
                    title="Archive Product"
                    class="hover:text-red-600 hover:bg-red-50"
                  >
                    <template #icon><Trash2 class="h-4 w-4" /></template>
                  </BaseButton>
                </div>
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
