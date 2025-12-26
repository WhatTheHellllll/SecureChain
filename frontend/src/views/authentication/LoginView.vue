<script setup>
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/store/authStore.js";
import { showError } from "@/utils/alert.js"; // Standardized import alias if available, else use relative

// COMPONENTS
import BaseInput from "@/components/base/BaseInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import { Package, LogIn } from "lucide-vue-next";

const router = useRouter();
const authStore = useAuthStore();

// Form State
const email = ref("");
const password = ref("");

const handleLogin = async () => {
  if (!email.value || !password.value) {
    showError("Please fill in both email and password.");
    return;
  }

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });

    // Redirect logic
    if (authStore.isSuperAdmin || authStore.isAdmin) {
      router.push("/admin/products/list");
    } else {
      router.push("/products/list");
    }
  } catch (err) {
    console.log(err);
    const msg = err.response?.data?.error || "Login failed. Please try again.";
    showError(msg);
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div
      class="bg-white p-10 rounded-xl shadow-lg w-full max-w-md border border-gray-100"
    >
      <div class="text-center mb-10">
        <div class="flex justify-center mb-4">
          <div class="p-3 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
            <Package class="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Welcome Back</h1>
        <p class="text-gray-500 mt-2 text-sm">
          Sign in to access your SecureChain dashboard
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <BaseInput
          v-model="email"
          label="Email Address"
          type="email"
          placeholder="admin@securechain.com"
          required
        />

        <BaseInput
          v-model="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          required
        />

        <BaseButton
          type="submit"
          variant="primary"
          :loading="authStore.loading"
          class="w-full justify-center py-2.5 text-base"
        >
          <template #icon><LogIn class="w-4 h-4" /></template>
          Sign In
        </BaseButton>
      </form>

      <div class="mt-8 text-center text-sm text-gray-600">
        <p>
          Don't have an account?
          <RouterLink
            to="/register"
            class="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors"
          >
            Create an account
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
