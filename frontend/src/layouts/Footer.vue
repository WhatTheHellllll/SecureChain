<script setup>
// No script needed for a static footer, but ready for expansion
</script>

<template>
  <footer class="bg-white border-t border-gray-200 mt-auto">
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="text-sm text-gray-500">
          &copy; {{ new Date().getFullYear() }}
          <span class="font-semibold text-indigo-900">SecureChain</span>. All
          rights reserved.
        </div>

        <div class="flex gap-6 text-sm text-gray-500">
          <a href="#" class="hover:text-indigo-600 transition-colors"
            >Privacy Policy</a
          >
          <a href="#" class="hover:text-indigo-600 transition-colors"
            >Terms of Service</a
          >
          <a href="#" class="hover:text-indigo-600 transition-colors"
            >Support</a
          >
        </div>
      </div>
    </div>
  </footer>
</template>
