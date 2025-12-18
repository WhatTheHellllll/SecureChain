import axios from 'axios';

// Create a configured instance of axios
const api = axios.create({
  // IMPORTANT: Make sure this port matches your Backend terminal (8000 or 3000)
  baseURL: 'http://localhost:3000/api/v1', 
  headers: {
    'Content-Type': 'application/json'
  }
});
// adds the Token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default api;