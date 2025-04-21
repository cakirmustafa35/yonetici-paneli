// src/services/authService.js
import api from './api';

const authService = {
    login: async (formData) => {
        try {
            const response = await api.get('/users');
            const user = response.data.find(
                u => u.email === formData.email && u.password === formData.password
            );

            if (user) {
                // Kullanıcı bilgilerini localStorage'a kaydet
                localStorage.setItem('user', JSON.stringify(user));

                // Aktivite kaydı ekle
                await api.post('/activities', {
                    userId: user.id,
                    userName: user.name,
                    action: 'login',
                    description: 'Kullanıcı giriş yaptı',
                    createdAt: new Date().toISOString()
                });

                return {
                    success: true,
                    user: user,
                    message: 'Giriş başarılı'
                };
            } else {
                return {
                    success: false,
                    error: 'Email veya şifre hatalı'
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: 'Giriş yapılırken bir hata oluştu'
            };
        }
    },

    logout: async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));

            if (user) {
                // Aktivite kaydı ekle
                await api.post('/activities', {
                    userId: user.id,
                    userName: user.name,
                    action: 'logout',
                    description: 'Kullanıcı çıkış yaptı',
                    createdAt: new Date().toISOString()
                });
            }

            // LocalStorage'dan kullanıcı bilgilerini temizle
            localStorage.removeItem('user');

            return {
                success: true,
                message: 'Çıkış başarılı'
            };
        } catch (error) {
            console.error('Logout error:', error);
            return {
                success: false,
                error: 'Çıkış yapılırken bir hata oluştu'
            };
        }
    }
};

export default authService;