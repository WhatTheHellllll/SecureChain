<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import productService from "../../services/productService.js";
import { showError, showSuccess } from "../../utils/alert.js";
import { usePermission } from "../../composables/usePermission.js";
import { PERMISSION_GROUPS } from "@backend/constants/permissions.js";
import ProductForm from "@/components/products/ProductForm.vue";

const router = useRouter();
const route = useRoute();
const { can } = usePermission();

const isAdminMode = computed(() => route.path.startsWith("/admin"));
const productRouteName = computed(() =>
  isAdminMode.value ? "admin-products-list" : "public-products-list"
);

const productData = ref({});
const loading = ref(true);
const saving = ref(false);

// Fetch Data on Mount
onMounted(async () => {
  try {
    if (!can(PERMISSION_GROUPS.PRODUCT.UPDATE)) {
      showError("You do not have permission to edit products.");
      router.push({ name: productRouteName.value });
      return;
    }

    const res = await productService.getProduct(route.params.id);
    productData.value = res.data.data;
  } catch (err) {
    showError("Failed to load product.");
    router.push({ name: productRouteName.value });
  } finally {
    loading.value = false;
  }
});

// Handle Update
const handleUpdate = async (formData) => {
  saving.value = true;
  try {
    await productService.update(route.params.id, formData);
    await showSuccess("Product updated!");
    router.push({ name: productRouteName.value });
  } catch (err) {
    showError(err.response?.data?.message || "Update failed.");
  } finally {
    saving.value = false;
  }
};
</script>
<template>
  <div
    class="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 border border-gray-100"
  >
    <div class="mb-8 border-b border-gray-100 pb-4">
      <h2 class="text-2xl font-bold text-gray-800">Edit Product</h2>
    </div>

    <div v-if="loading" class="text-center py-10 text-indigo-600 font-medium">
      Loading product details...
    </div>

    <ProductForm
      v-else
      :initial-data="productData"
      :is-edit-mode="true"
      :loading="saving"
      @submit="handleUpdate"
      @cancel="router.push({ name: productRouteName })"
    />
  </div>
</template>
<!-- <template>
  <div
    class="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 border border-gray-100"
  >
    <div class="mb-8 border-b border-gray-100 pb-4">
      <h2 class="text-2xl font-bold text-gray-800">Edit Product</h2>
      <p class="text-sm text-gray-500 mt-1">Update product details.</p>
    </div>

    <div v-if="loading" class="flex justify-center py-10">
      <span class="text-indigo-600 animate-pulse font-medium"
        >Loading product details...</span
      >
    </div>

    <form v-else @submit.prevent="handleUpdate" class="space-y-6">
      <BaseInput
        v-model="form.name"
        label="Product Name"
        :error="errors.name"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput v-model="form.sku" label="SKU" :error="errors.sku" />
        <BaseInput
          v-model="form.category"
          label="Category"
          :error="errors.category"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          v-model="form.price"
          label="Price ($)"
          type="number"
          step="0.01"
          :error="errors.price"
        />
        <BaseInput
          v-model="form.quantity"
          label="Quantity"
          type="number"
          :error="errors.quantity"
        />
      </div>

      <div class="flex justify-end space-x-3 pt-6 border-t border-gray-100">
        <BaseButton
          type="button"
          variant="secondary"
          @click="router.push({ name: productRouteName })"
        >
          Cancel
        </BaseButton>

        <BaseButton type="submit" variant="primary" :loading="saving">
          <template #icon><Save class="w-4 h-4" /></template>
          Save Changes
        </BaseButton>
      </div>
    </form>
  </div>
</template> -->
