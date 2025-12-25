<script setup>
import { ref, watch } from "vue";
import BaseInput from "../base/BaseInput.vue";
import BaseButton from "../base/BaseButton.vue";
import { Save } from "lucide-vue-next";

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({ name: "", sku: "", category: "", price: 0, quantity: 0 }),
  },
  loading: { type: Boolean, default: false },
  isEditMode: { type: Boolean, default: false },
});

const emit = defineEmits(["submit", "cancel"]); // Added 'cancel' emit

const form = ref({ ...props.initialData });
const errors = ref({});

watch(
  () => props.initialData,
  (newData) => {
    form.value = { ...newData };
  },
  { deep: true }
);

const validate = () => {
  errors.value = {};
  let isValid = true;
  if (!form.value.name) {
    errors.value.name = "Name is required";
    isValid = false;
  }
  if (!form.value.sku) {
    errors.value.sku = "SKU is required";
    isValid = false;
  }
  if (!form.value.category) {
    errors.value.category = "Category is required";
    isValid = false;
  }
  if (!form.value.price || form.value.price <= 0) {
    errors.value.price = "Invalid price";
    isValid = false;
  }
  if (form.value.quantity === "" || form.value.quantity < 0) {
    errors.value.quantity = "Invalid quantity";
    isValid = false;
  }
  return isValid;
};

const handleSubmit = () => {
  if (!validate()) return;
  emit("submit", form.value);
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <BaseInput v-model="form.name" label="Product Name" :error="errors.name" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseInput
        v-model="form.sku"
        label="SKU"
        :error="errors.sku"
        :disabled="isEditMode"
      />
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

    <div class="flex justify-end pt-6 border-t border-gray-100 gap-3">
      <BaseButton type="button" variant="secondary" @click="$emit('cancel')">
        Cancel
      </BaseButton>

      <BaseButton type="submit" variant="primary" :loading="loading">
        <template #icon><Save class="w-4 h-4" /></template>
        {{ isEditMode ? "Update Product" : "Create Product" }}
      </BaseButton>
    </div>
  </form>
</template>
