import api from './api';

export default {
  getAll() {
    return api.get('/products/list');
  },
  getOne(id) {
    return api.get(`/products/get/${id}`);
  },
  create(data) {
    return api.post('/products/create', data);
  },
  update(id, data) {
    return api.put(`/products/update/${id}`, data);
  },
  delete(id) {
    return api.delete(`/products/delete/${id}`);
  }
};