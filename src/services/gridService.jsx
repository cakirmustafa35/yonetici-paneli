// src/services/gridService.jsx
import userOperations from './userService';
import api from './api';

const gridOperations = {
    addActivity: async (action, description) => {
        try {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            if (!currentUser || !currentUser.id) {
                console.error('No user found in localStorage');
                return {
                    success: false,
                    error: 'Oturum açmış kullanıcı bulunamadı'
                };
            }

            const newActivity = {
                id: Date.now().toString(),
                userId: currentUser.id.toString(),
                userName: currentUser.name,
                action: action,
                description: description,
                createdAt: new Date().toISOString()
            };

            console.log('Adding activity:', newActivity);
            const response = await api.post('/activities', newActivity);
            console.log('Activity saved:', response.data);

            return {
                success: true,
                data: response.data,
                message: 'Aktivite başarıyla kaydedildi'
            };
        } catch (error) {
            console.error('Error adding activity:', error);
            return {
                success: false,
                error: 'Aktivite kaydedilirken hata oluştu'
            };
        }
    },

    handleGridAdd: async (e) => {
        try {
            const result = await userOperations.addUser(e.data);
            if (result.success) {
                console.log('User added successfully');
                const activityResult = await gridOperations.addActivity(
                    'create',
                    `Yeni kullanıcı eklendi: ${e.data.name}`
                );

                if (!activityResult.success) {
                    console.error('Failed to add activity record:', activityResult.error);
                }

                return {
                    success: true,
                    data: result.data,
                    message: 'Kullanıcı başarıyla eklendi'
                };
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error adding user:', error);
            return {
                success: false,
                error: 'Kullanıcı eklenirken hata oluştu'
            };
        }
    },

    handleGridUpdate: async (e) => {
        try {
            const updatedData = {
                ...e.oldData,
                ...e.newData
            };

            const result = await userOperations.updateUser(e.key, updatedData);
            if (result.success) {
                console.log('User updated successfully');
                const activityResult = await gridOperations.addActivity(
                    'update',
                    `Kullanıcı güncellendi: ${e.oldData.name}`
                );

                if (!activityResult.success) {
                    console.error('Failed to add activity record:', activityResult.error);
                }

                return {
                    success: true,
                    data: result.data,
                    message: 'Kullanıcı başarıyla güncellendi'
                };
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            return {
                success: false,
                error: 'Kullanıcı güncellenirken hata oluştu'
            };
        }
    },

    handleGridDelete: async (e) => {
        try {
            console.log('Delete operation started for:', {
                key: e.key,
                data: e.data
            });

            const result = await userOperations.deleteUser(e.key);
            if (result.success) {
                console.log('User deleted successfully');
                const activityResult = await gridOperations.addActivity(
                    'delete',
                    `Kullanıcı silindi: ${e.data.name}`
                );

                if (!activityResult.success) {
                    console.error('Failed to add activity record:', activityResult.error);
                }

                return {
                    success: true,
                    message: 'Kullanıcı başarıyla silindi'
                };
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            return {
                success: false,
                error: 'Kullanıcı silinirken hata oluştu'
            };
        }
    },

    loadGridData: async () => {
        try {
            const result = await userOperations.getUsers();
            if (result.success) {
                return {
                    success: true,
                    data: result.data,
                    message: 'Grid verileri başarıyla yüklendi'
                };
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error loading grid data:', error);
            return {
                success: false,
                error: 'Grid verileri yüklenirken hata oluştu'
            };
        }
    }
};

export default gridOperations;