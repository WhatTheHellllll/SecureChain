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
  // This calls GET /api/v1/products/list
  getProducts() {
    return api.get('/products');
  },
  getProduct(id) {
    return api.get(`/products/${id}`);
  },
  createProduct(data) {
    return api.post('/products', data);
  },
  updateProduct(id, data) {
    return api.put(`/products/${id}`, data);
  },
  deleteProduct(id) {
    return api.delete(`/products/${id}`);
  }
  
};