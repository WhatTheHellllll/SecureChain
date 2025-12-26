<script setup>
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/store/authStore.js";
import { showSuccess, showError } from "@/utils/alert.js";

// COMPONENTS
import BaseInput from "@/components/base/BaseInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import { UserPlus, Package } from "lucide-vue-next";

const router = useRouter();
const authStore = useAuthStore();

const name = ref("");
const email = ref("");
const password = ref("");

const handleRegister = async () => {
  if (!name.value || !email.value || !password.value) {
    showError("Please fill in all fields.");
    return;
  }

  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
    });

    await showSuccess("Account created successfully!");
    router.push("/products/list");
  } catch (err) {
    const msg = err.response?.data?.error || "Registration failed";
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
          <div class="p-3 bg-white border-2 border-indigo-100 rounded-lg">
            <Package class="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <h2 class="text-2xl font-bold text-gray-900">Create Account</h2>
        <p class="text-gray-500 mt-2 text-sm">
          Join SecureChain to manage your inventory
        </p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <BaseInput
          v-model="name"
          label="Full Name"
          placeholder="John Doe"
          required
        />

        <BaseInput
          v-model="email"
          label="Email Address"
          type="email"
          placeholder="john@example.com"
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
          <template #icon><UserPlus class="w-4 h-4" /></template>
          Create Account
        </BaseButton>
      </form>

      <p class="mt-8 text-center text-sm text-gray-600">
        Already have an account?
        <RouterLink
          to="/login"
          class="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
        >
          Sign in instead
        </RouterLink>
      </p>
    </div>
  </div>
</template>
