<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import authApi from '../services/auth.service.js';
import { showSuccess, showError } from '../utils/alert';

const router = useRouter();

// 1. Form State
const email = ref('');
const password = ref('');
const loading = ref(false);

// 2. Handle Login Logic
const handleLogin = async () => {
  // Simple validation
  if (!email.value || !password.value) {
    showError("Please fill in both email and password.");
    return;
  }

  loading.value = true;

  try {
    // A. Call the API
    const response = await authApi.login({
      email: email.value,
      password: password.value
    });

    // B. Save the "Keys" to the Browser
    // This is the most important part! Without this, the Bouncer kicks you out.
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    // C. Show Success & Redirect
    await showSuccess(`Welcome back, ${response.data.user.name}!`);
    router.push('/products'); 

  } catch (err) {
    console.error(err);
    // Grab the specific message from backend (e.g. "Invalid credentials")
    const msg = err.response?.data?.error || 'Login failed. Please try again.';
    showError(msg);
  } finally {
    loading.value = false;
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
          <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="admin@securechain.com"
            required
            class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
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
          :disabled="loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>

      </form>
      
      <div class="mt-6 text-center text-sm text-gray-600">
        <p>
          Don't have an account? 
          <RouterLink to="/register" class="font-medium text-blue-600 hover:text-blue-500 hover:underline">
            Register here
          </RouterLink>
        </p>
      </div>

    </div>
  </div>
</template>