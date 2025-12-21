import api from './api';

export default {

    getAllUsers() {
        return api.get('/users/list');
    },
    updateUser(userId, data) {
        return api.put(`/users/update/${userId}`, data);
    }
};