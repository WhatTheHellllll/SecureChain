<script setup>
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/store/authStore.js";
import { showError } from "../../utils/alert.js";

const router = useRouter();
const authStore = useAuthStore(); // 2. Initialize Store

// Form State
const email = ref("");
const password = ref("");

// Handle Login Logic
const handleLogin = async () => {
  // Validation
  if (!email.value || !password.value) {
    showError("Please fill in both email and password.");
    return;
  }

  try {
    // 3. Use Store Action
    // The store handles loading state, API calls, and storage saving
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    // Navigation
    if (authStore.isSuperAdmin || authStore.isAdmin) {
      router.push("/admin/products/list");
    } else {
      router.push("/products/list");
    }
  } catch (err) {
    // The store throws the error back so we can show the alert
    console.log(err);
    const msg = err.response?.data?.error || "Login failed. Please try again.";
    showError(msg);
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-slate-800">⛓️ SecureChain</h1>
        <p class="text-gray-500 mt-2">Sign in to manage your inventory</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Email Address</label
          >
          <input
            v-model="email"
            type="email"
            placeholder="admin@securechain.com"
            required
            class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          {{ authStore.loading ? "Signing in..." : "Sign In" }}
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-gray-600">
        <p>
          Don't have an account?
          <RouterLink
            to="/register"
            class="font-medium text-blue-600 hover:text-blue-500 hover:underline"
          >
            Register here
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
