import React from 'react'
import { useState, useEffect } from 'react'
import api from '../services/api'
import '../css/dashboard.css'

function Dashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalDepartments: 0,
        activeDepartments: 0,
    });

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    const fetchActivities = async () => {
        try {
            const response = await api.get('/activities');
            // Aktiviteleri tarihe göre sırala (en yeni en üstte)
            const sortedActivities = response.data.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            setActivities(sortedActivities);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    useEffect(() => {
        const dashboardData = async () => {
            try {
                const [usersResponse, departmentsResponse] = await Promise.all([
                    api.get('/users'),
                    api.get('/departments')
                ]);

                const users = usersResponse.data;
                const activeUsers = users.filter(user => user.status === 'active');

                const departments = departmentsResponse.data;
                const activeDepartments = departments.filter(department => department.status === 'active');

                setStats({
                    totalUsers: users.length,
                    activeUsers: activeUsers.length,
                    totalDepartments: departments.length,
                    activeDepartments: activeDepartments.length,
                });

                // Activities'i ayrı bir fonksiyonda çağır
                await fetchActivities();
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Veriler yüklenirken bir hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        // İlk yükleme
        dashboardData();

        // Her 2 saniyede bir activities güncelle
        const activitiesInterval = setInterval(fetchActivities, 2000);

        // Her 10 saniyede bir tüm dashboard verilerini güncelle
        const dashboardInterval = setInterval(dashboardData, 10000);

        // Cleanup function
        return () => {
            clearInterval(activitiesInterval);
            clearInterval(dashboardInterval);
        };
    }, []);

    if (loading) {
        return <div className="loading-container">Yükleniyor...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }


    const getTexts = (eleman) => {
        console.log("sss"
            , eleman)
        const texts =
        {
            "create": "olust"
            , "update": "ols",
            "login": "giriş",



        }
        return texts[eleman] || eleman
    }


    return (
        <div className='dashboard-container'>
            <h1>Yönetici Paneli</h1>
            <div className='stats-container'>
                <div className='stats-card'>
                    <h3>Toplam Kullanıcı</h3>
                    <div>{stats.totalUsers}</div>
                </div>
                <div className='stats-card'>
                    <h3>Toplam Departman</h3>
                    <div>{stats.totalDepartments}</div>
                </div>
                <div className='stats-card'>
                    <h3>Aktif Kullanıcı</h3>
                    <div>{stats.activeUsers}</div>
                </div>
                <div className='stats-card'>
                    <h3>Aktif Departman</h3>
                    <div>{stats.activeDepartments}</div>
                </div>
            </div>
            <div className="activities-container">
                <h2>Son Aktiviteler</h2>
                <div className="activities-list">
                    {activities.map(activity => (
                        <div key={activity.id} className={`activity-item`} data-action={activity.action}>
                            <div>
                                <strong>{activity.userName}</strong>
                                {' - '}
                                {getTexts(activity.action)}
                                {' işlemi - '}
                                {activity.description}
                                {' - '}
                                <span>{new Date(activity.createdAt).toLocaleString('tr-TR')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;