import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, usersAPI } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            usersAPI.getCurrentUser()
                .then(res => setUser(res.data))
                .catch(() => localStorage.removeItem('token'))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        const res = await authAPI.login({ username, password });
        localStorage.setItem('token', res.data.token); // Backend returns token as JSON { "token": "..." }
        const userRes = await usersAPI.getCurrentUser();
        setUser(userRes.data);
    };

    const register = async (userData) => {
        const res = await authAPI.register(userData);
        localStorage.setItem('token', res.data.token);
        const userRes = await usersAPI.getCurrentUser();
        setUser(userRes.data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
