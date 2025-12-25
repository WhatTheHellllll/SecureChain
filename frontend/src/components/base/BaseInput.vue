<script setup>
defineProps({
  label: { type: String, default: "" },
  modelValue: { type: [String, Number], default: "" },
  type: { type: String, default: "text" },
  placeholder: { type: String, default: "" },
  required: { type: Boolean, default: false },
  step: { type: String, default: null },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: null }, // 👈 Added this for validation support
});

defineEmits(["update:modelValue"]);
</script>

<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>

    <input
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :required="required"
      :step="step"
      :disabled="disabled"
      class="block w-full rounded-lg shadow-sm sm:text-sm p-2.5 border transition-colors disabled:bg-gray-100 disabled:text-gray-500"
      :class="[
        error
          ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
      ]"
    />

    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>
