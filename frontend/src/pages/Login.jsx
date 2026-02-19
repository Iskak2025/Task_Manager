import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Неверное имя пользователя или пароль');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '2.5rem',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface)'
                }}
            >
                <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: '800', textAlign: 'center' }}>ВХОД</h1>
                {error && <p style={{ color: 'var(--text)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 'bold' }}>ИМЯ ПОЛЬЗОВАТЕЛЯ</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                border: '1px solid var(--border)',
                                backgroundColor: 'var(--bg)',
                                color: 'var(--text)',
                                outline: 'none'
                            }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 'bold' }}>ПАРОЛЬ</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                border: '1px solid var(--border)',
                                backgroundColor: 'var(--bg)',
                                color: 'var(--text)',
                                outline: 'none'
                            }}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            backgroundColor: 'var(--text)',
                            color: 'var(--bg)',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}
                    >
                        Войти
                    </button>
                </form>
                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    Нет аккаунта? <Link to="/register" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Зарегистрироваться</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
