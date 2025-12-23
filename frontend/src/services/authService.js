import api from "./api";

export default {
  login(credentials) {
    return api.post("/auth/login", credentials);
  },
  register(userData) {
    return api.post("/auth/register", userData);
  },
  logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    // Any other cleanup
  },
};
