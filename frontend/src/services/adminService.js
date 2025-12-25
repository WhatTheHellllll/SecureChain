import api from "./api";

export default {
  getAllUsers() {
    return api.get(`/users/list`);
  },
  updateUser(userId, data) {
    return api.put(`/users/update/${userId}`, data);
  },
  getAuditLogs() {
    return api.get("/audit/audit-logs");
  },
  // Optional: Fetch history for a specific item
  getEntityHistory(type, id) {
    return api.get(`/audit/audit-logs/${type}/${id}`);
  },
  deleteUser(id) {
    return api.delete(`/users/delete/${id}`);
  },
};
