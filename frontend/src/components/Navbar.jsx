import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home } from 'lucide-react';

const Navbar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    return (
        <nav style={{
            borderBottom: '1px solid var(--border)',
            padding: '1rem 0',
            marginBottom: '2rem',
            backgroundColor: 'var(--bg)'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ fontSize: '1.2rem', fontWeight: '900', letterSpacing: '2px' }}>TASK_MANAGER</Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-soft)' }}>
                        {user?.username.toUpperCase()}
                    </span>
                    <button onClick={() => { logout(); navigate('/login'); }} style={{ color: 'var(--text)' }}>
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
