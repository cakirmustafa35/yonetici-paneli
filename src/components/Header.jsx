import React, { useEffect, useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import '../css/header.css'
function Header() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // LocalStorage'dan user kontrolü
        const user = localStorage.getItem('user');
        setIsLoggedIn(!!user);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        navigate('/');
    }

    // Kullanıcı giriş yapmamışsa header'ı gösterme
    if (!isLoggedIn) {
        return null;
    }

    return (
        <header className="header">
            <div className="header-left">
                <h1 className="logo">Admin Panel</h1>
                <nav className="nav-menu">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    >
                        Anasayfa
                    </NavLink>
                    <NavLink
                        to="/users"
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    >
                        Kullanıcılar
                    </NavLink>
                </nav>
            </div>
            <div className="header-right">
                <div className="user-info">
                    <span className="user-name">
                        {JSON.parse(localStorage.getItem('user'))?.name}
                    </span>
                    <button className="logout-btn" onClick={handleLogout}>
                        Çıkış Yap
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header