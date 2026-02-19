import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                border: '1px solid var(--border)',
                borderRadius: '4px'
            }}
        >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
    );
};

export default ThemeToggle;
