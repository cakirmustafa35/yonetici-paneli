import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService';
import '../css/Login.css';

function Login() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // Eğer kullanıcı zaten giriş yapmışsa dashboard'a yönlendir
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        setError('') // Her değişiklikte hata mesajını temizle
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        setError('');
        try {
            const result = await authService.login(formData)
            if (result.success) {
                // Kullanıcı bilgilerini localStorage'a kaydet
                localStorage.setItem('user', JSON.stringify(result.user));
                // Sayfayı yenile ve dashboard'a yönlendir
                window.location.href = '/dashboard';
            } else {
                setError(result.error || 'Giriş yapılamadı');
            }
        } catch (error) {
            console.error('Login error:', error)
            setError('Giriş yapılırken hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='login-container'>
            <div className='login-box'>
                <div className='login-header'>
                    <h1>Hoş Geldiniz</h1>
                    <p>Devam etmek için giriş yapın</p>
                </div>
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className='error-message'>{error}</div>
                    )}
                    <div className='form-group'>
                        <label>E-mail</label>
                        <input
                            type="email"
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="E-mail adresinizi girin"
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label>Şifre</label>
                        <input
                            type="password"
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Şifrenizi girin"
                            required
                        />
                    </div>
                    <button
                        type='submit'
                        disabled={loading}
                        className='login-button'
                    >
                        {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                    </button>
                </form>
                <div className='login-footer'>
                    <a href="#" onClick={(e) => e.preventDefault()}>Şifremi Unuttum</a>
                </div>
            </div>
        </div>
    )
}

export default Login