import { defineStore } from "pinia";
import authService from "../services/authService";
import { ROLES } from "@backend/constants/roles.js";
export const useAuthStore = defineStore("auth", {
  state: () => ({
    // Initialize from storage so we don't lose login on refresh
    user: JSON.parse(sessionStorage.getItem("user")) || null,
    token: sessionStorage.getItem("token") || null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    // Update this to handle both populated objects and ID strings safely
    isAdmin: (state) => {
      const roleName = state.user?.role?.name || state.user?.role;
      return [ROLES.SUPER_ADMIN, ROLES.SUB_ADMIN].includes(roleName);
    },

    // Useful for your UI logic
    isSuperAdmin: (state) => {
      const roleName = state.user?.role?.name || state.user?.role;
      return roleName === ROLES.SUPER_ADMIN;
    },
    userRole: (state) => state.user?.role?.name || state.user?.role || "viewer",
  },

  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authService.login(credentials);

        this.setAuth(response.data);
        return response;
      } catch (err) {
        this.error = err.response?.data?.error || "Login failed";
        console.log(err);
        throw err; // Re-throw so the View can show the specific alert
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authService.register(userData);
        this.setAuth(response.data); // Auto-login after register
        return response;
      } catch (err) {
        this.error = err.response?.data?.error || "Registration failed";
        throw err.response;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      // If you decide to use localStorage later, clear that too
      // localStorage.removeItem('token');
    },

    // Helper to save state
    setAuth(data) {
      this.user = data.user;
      this.token = data.token;

      // Save to Session Storage (Persist on refresh)
      sessionStorage.setItem("user", JSON.stringify(data.user));
      sessionStorage.setItem("token", data.token);
    },
  },
});
