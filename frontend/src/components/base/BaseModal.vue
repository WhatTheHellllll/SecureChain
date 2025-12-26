<script>
export default {
  inheritAttrs: false, // 👈 This stops the crash by ignoring extra attributes
};
</script>
<script setup>
import { onMounted, onUnmounted, watch } from "vue";
import { X } from "lucide-vue-next"; // Ensure you have icons installed

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: "" }, // Optional header
  maxWidth: { type: String, default: "2xl" }, // Control width (sm, md, lg, xl, 2xl)
});

const emit = defineEmits(["close"]);

// 1. Close on Escape key
const handleKeydown = (e) => {
  if (e.key === "Escape" && props.show) {
    emit("close");
  }
};

// Add/Remove keyboard listeners
onMounted(() => document.addEventListener("keydown", handleKeydown));
onUnmounted(() => document.removeEventListener("keydown", handleKeydown));

// 2. Prevent background scrolling when open
watch(
  () => props.show,
  (isOpen) => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }
);

// Map simple size names to Tailwind classes
const maxWidthClass = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  "4xl": "sm:max-w-4xl",
}[props.maxWidth];
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-sm"
        @click="emit('close')"
      >
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <div
            class="relative w-full transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all"
            :class="maxWidthClass"
            @click.stop
          >
            <div
              v-if="title"
              class="border-b border-gray-100 px-6 py-4 flex justify-between items-center bg-gray-50/50"
            >
              <h3 class="text-lg font-semibold text-gray-900">
                {{ title }}
              </h3>
              <button
                @click="emit('close')"
                class="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
              >
                <X class="h-5 w-5" />
              </button>
            </div>

            <div class="px-6 py-6">
              <slot />
            </div>

            <div
              v-if="$slots.footer"
              class="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100"
            >
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
