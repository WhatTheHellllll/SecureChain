import api from './api';

export default {
  login(credentials) {
    return api.post('/auth/login', credentials);
  },
  register(userData) {
    return api.post('/auth/register', userData);
  },
  logout() {
    localStorage.removeItem('token');
    // Any other cleanup
  }
};