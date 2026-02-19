import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
    const [form, setForm] = useState({ username: '', email: '', password: '', adminCode: '' });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(form);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка регистрации');
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
                <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: '800', textAlign: 'center' }}>РЕГИСТРАЦИЯ</h1>
                {error && <p style={{ color: 'var(--text)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 'bold' }}>ИМЯ ПОЛЬЗОВАТЕЛЯ</label>
                        <input
                            type="text"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            style={{ width: '100%', padding: '0.7rem', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text)' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 'bold' }}>EMAIL</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            style={{ width: '100%', padding: '0.7rem', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text)' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 'bold' }}>ПАРОЛЬ</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            style={{ width: '100%', padding: '0.7rem', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text)' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 'bold' }}>КОД АДМИНИСТРАТОРА (ОПЦИОНАЛЬНО)</label>
                        <input
                            type="text"
                            value={form.adminCode}
                            onChange={(e) => setForm({ ...form, adminCode: e.target.value })}
                            style={{ width: '100%', padding: '0.7rem', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text)' }}
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
                        Создать аккаунт
                    </button>
                </form>
                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    Уже есть аккаунт? <Link to="/login" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Войти</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
