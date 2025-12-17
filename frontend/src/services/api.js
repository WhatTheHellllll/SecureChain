import axios from 'axios';

// Create a configured instance of axios
const api = axios.create({
  // IMPORTANT: Make sure this port matches your Backend terminal (8000 or 3000)
  baseURL: 'http://localhost:3000/api/v1', 
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  getProducts() {
    return api.get('/products/list');
  },
  getProduct(id) {
    return api.get(`/products/get/${id}`);
  },
  createProduct(data) {
    return api.post('/products/create', data);
  },
  updateProduct(id, data) {
    return api.put(`/products/update/${id}`, data);
  },
  deleteProduct(id) {
    return api.delete(`/products/delete/${id}`);
  }
  
};