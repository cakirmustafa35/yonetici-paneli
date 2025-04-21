// src/services/userService.js
import api from './api';

const userOperations = {
    getUsers: async () => {
        try {
            const response = await api.get('/users');
            console.log('Get users response:', response);
            return {
                success: true,
                data: response.data,
                message: 'Kullanıcı listesi getirildi'
            };
        } catch (error) {
            console.error('Get users error:', error);
            return {
                success: false,
                error: 'Kullanıcı listesi alınamadı'
            };
        }
    },

    addUser: async (userData) => {
        try {
            console.log('Adding user:', userData);
            const newUser = {
                ...userData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                status: userData.status || 'active',
                role: userData.role || 'user'
            };

            const response = await api.post('/users', newUser);
            console.log('Add user response:', response);

            if (response && response.data) {
                return {
                    success: true,
                    data: response.data,
                    message: 'Kullanıcı başarıyla eklendi'
                };
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Add user error:', error);
            return {
                success: false,
                error: 'Kullanıcı eklenirken hata oluştu'
            };
        }
    },

    updateUser: async (id, userData) => {
        try {
            console.log('Updating user:', { id, userData });
            const response = await api.put(`/users/${id}`, userData);
            console.log('Update user response:', response);

            if (response && response.data) {
                return {
                    success: true,
                    data: response.data,
                    message: 'Kullanıcı bilgileri güncellendi'
                };
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Update user error:', error);
            return {
                success: false,
                error: 'Kullanıcı güncellenirken hata oluştu'
            };
        }
    },

    deleteUser: async (id) => {
        try {
            console.log('Deleting user:', id);
            const response = await api.delete(`/users/${id}`);
            console.log('Delete user response:', response);

            // json-server DELETE işleminde boş response dönebilir
            if (response.status === 200) {
                return {
                    success: true,
                    message: 'Kullanıcı başarıyla silindi'
                };
            } else {
                throw new Error('Unexpected response status: ' + response.status);
            }
        } catch (error) {
            console.error('Delete user error:', error);
            return {
                success: false,
                error: 'Kullanıcı silinirken hata oluştu'
            };
        }
    }
};

export default userOperations;