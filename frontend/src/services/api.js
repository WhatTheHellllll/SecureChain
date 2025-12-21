import axios from 'axios';
import router from '@/router';

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
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // If the request succeeds, just return the data as normal
    return response;
  },
  (error) => {
    // If the error is a 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      
      // A. Clear the invalid/expired session data
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user'); // If you store user info too
      
      // B. Force redirect to the Login page
      // (This works because we imported 'router' at the top)
      router.push('/login');
    }

    // C. Still reject the promise so the component knows it failed
    // (This prevents the component from trying to use empty data)
    return Promise.reject(error);
  }
);
export default api;