<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../store/authStore.js"; // 1. Import Store
import { showSuccess, showError } from "../../utils/alert.js";

const router = useRouter();
const authStore = useAuthStore(); // 2. Initialize Store

// Form State
const name = ref(""); // Added Name (Required by Backend)
const email = ref("");
const password = ref("");

const handleRegister = async () => {
  // Basic frontend validation
  if (!name.value || !email.value || !password.value) {
    showError("Please fill in all fields.");
    return;
  }

  try {
    // 3. Call Store Action
    // The store handles API calls and auto-saves the token
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
    });

    await showSuccess("Account created successfully!");
    router.push("/products/list");
  } catch (err) {
    // Store throws the error back to us
    const msg = err.response?.data?.error || "Registration failed";
    showError(msg);
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-8">
        Create Account
      </h2>

      <form @submit.prevent="handleRegister" class="space-y-6">
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Full Name</label>
          <input 
            v-model="name" 
            type="text" 
            placeholder="John Doe" 
            required 
            class="input-std" 
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="john@example.com" 
            required 
            class="input-std" 
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            class="input-std"
          />
        </div>

        <button type="submit" :disabled="authStore.loading" class="btn-primary w-full">
          {{ authStore.loading ? "Creating Account..." : "Register" }}
        </button>
      </form>

      <p class="mt-4 text-center text-sm text-gray-600">
        Already have an account?
        <RouterLink to="/login" class="text-blue-600 hover:underline">Login</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.input-std {
  @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border;
}

.btn-primary {
  @apply flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors;
}
</style>