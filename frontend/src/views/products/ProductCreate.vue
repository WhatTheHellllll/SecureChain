<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import productService from "../../services/productService.js";
import { showError, showSuccess } from "../../utils/alert.js";
import ProductForm from "@/components/products/ProductForm.vue";

const router = useRouter();
const route = useRoute();
const loading = ref(false);

const isAdminMode = computed(() => route.path.startsWith("/admin"));
const productRouteName = computed(() =>
  isAdminMode.value ? "admin-products-list" : "public-products-list"
);

// const validate = () => {
//   errors.value = {}; // Reset errors
//   let isValid = true;

//   if (!form.value.name) {
//     errors.value.name = "Product name is required.";
//     isValid = false;
//   }
//   if (!form.value.sku) {
//     errors.value.sku = "SKU is required.";
//     isValid = false;
//   }
//   if (!form.value.category) {
//     errors.value.category = "Category is required.";
//     isValid = false;
//   }
//   if (!form.value.price || form.value.price <= 0) {
//     errors.value.price = "Price must be greater than 0.";
//     isValid = false;
//   }
//   if (form.value.quantity === "" || form.value.quantity < 0) {
//     errors.value.quantity = "Quantity cannot be negative.";
//     isValid = false;
//   }

//   return isValid;
// };

const handleSubmit = async (formData) => {
  loading.value = true;
  try {
    await productService.create(formData);
    await showSuccess("Product created successfully.");
    router.push({ name: productRouteName.value });
  } catch (err) {
    showError(err.response?.data?.message || "Failed to create product.");
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <div
    class="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 border border-gray-100"
  >
    <div class="mb-8 border-b border-gray-100 pb-4">
      <h2 class="text-2xl font-bold text-gray-800">Add New Product</h2>
    </div>

    <ProductForm
      @submit="handleSubmit"
      @cancel="router.push({ name: productRouteName })"
      :loading="loading"
    />
  </div>
</template>
<!-- <template>
  <div
    class="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 border border-gray-100"
  >
    <div class="mb-8 border-b border-gray-100 pb-4">
      <h2 class="text-2xl font-bold text-gray-800">Add New Product</h2>
      <p class="text-sm text-gray-500 mt-1">
        Enter the details to create a new inventory item.
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <BaseInput
        v-model="form.name"
        label="Product Name"
        placeholder="e.g. Wireless Mouse"
        :error="errors.name"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          v-model="form.sku"
          label="SKU"
          placeholder="e.g. WM-001"
          :error="errors.sku"
        />
        <BaseInput
          v-model="form.category"
          label="Category"
          placeholder="e.g. Electronics"
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

        <BaseButton type="submit" variant="primary" :loading="loading">
          <template #icon><Save class="w-4 h-4" /></template>
          Create Product
        </BaseButton>
      </div>
    </form>
  </div>
</template> -->
