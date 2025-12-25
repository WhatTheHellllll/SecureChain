<script setup>
import { computed } from "vue";
import { Loader2 } from "lucide-vue-next";

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (val) =>
      ["primary", "secondary", "danger", "ghost", "icon"].includes(val),
  },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  type: { type: String, default: "button" }, // 'button' or 'submit'
});

// BASE STYLES: Added 'justify-center' and 'items-center' to ensure icons align
const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

// VARIANTS: Standardized colors
const variants = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm",
  secondary:
    "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-200 shadow-sm",
  danger:
    "bg-white border border-red-200 text-red-600 hover:bg-red-50 focus:ring-red-200 shadow-sm", // Bordered Red
  ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  icon: "p-2 text-gray-500 hover:bg-gray-100 hover:text-slate-900 rounded-full", // Default Gray Icon
};

const computedClasses = computed(() => {
  const variantClass = variants[props.variant] || variants.primary;
  // If variant is 'icon', we ignore padding (handled in variantClass). Otherwise use standard padding.
  const paddingClass = props.variant === "icon" ? "" : "px-4 py-2 text-sm";

  // CRITICAL: Ensure spaces between these strings!
  return `${baseClass} ${variantClass} ${paddingClass}`;
});
</script>

<template>
  <button :type="type" :class="computedClasses" :disabled="disabled || loading">
    <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
    <slot name="icon" v-else /> <slot />
  </button>
</template>
