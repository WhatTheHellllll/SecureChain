<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import authService from "../../services/authService.js";
import { showSuccess, showError } from "../../utils/alert.js";

const router = useRouter();
const email = ref("");
const password = ref("");
const loading = ref(false);

const handleRegister = async () => {
  loading.value = true;
  try {
    const response = await authService.register({
      email: email.value,
      password: password.value,
    });

    // Auto-login after register
    sessionStorage.setItem("token", response.data.token);
    sessionStorage.setItem("user", JSON.stringify(response.data.user));

    await showSuccess("Account created successfully!");
    router.push("/products");
  } catch (err) {
    const msg = err.response?.data?.error || "Registration failed";
    showError(msg);
  } finally {
    loading.value = false;
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
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" required class="input-std" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            required
            class="input-std"
          />
        </div>

        <button type="submit" :disabled="loading" class="btn-primary w-full">
          {{ loading ? "Creating Account..." : "Register" }}
        </button>
      </form>

      <p class="mt-4 text-center text-sm text-gray-600">
        Already have an account?
        <RouterLink to="/login" class="text-blue-600">Login</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.input-std {
  @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border;
}

.btn-primary {
  @apply flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300;
}
</style>
