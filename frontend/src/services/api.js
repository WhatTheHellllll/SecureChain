import axios from "axios";
import router from "@/router";

// Define Base URL (Uses environment var if available, defaults to localhost:8000)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
// Adds the Token to every request if it exists in storage
api.interceptors.request.use(
  (config) => {
    // We read from sessionStorage to match your authStore persistence strategy
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // If the request succeeds, just return the data as normal
    return response;
  },
  (error) => {
    // If the error is a 401 (Unauthorized) -> Token expired or invalid
    if (error.response && error.response.status === 401) {
      console.warn("Session expired. Redirecting to login...");

      // A. Clear storage so the Store knows we are logged out on next refresh
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      // B. Force redirect to Login
      router.push("/login");
    }

    return Promise.reject(error);
  }
);
export default api;
