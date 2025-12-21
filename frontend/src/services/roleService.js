import api from './api';

export default {
  getRoles() {
    return api.get('/roles/list');
  },
  createRole(data) {
    return api.post('/roles/create', data);
  },
  updateRole(id, data) {
    return api.put(`/roles/update/${id}`, data);
  },
  deleteRole(id) {
    return api.delete(`/roles/delete/${id}`);
  },
  getPermissions() {
  return api.get('/roles/permissions');
}
};