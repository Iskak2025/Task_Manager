import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Trash2, Search, Star } from 'lucide-react';
import { usersAPI, projectsAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';

const MemberManager = ({ project, onClose, onUpdate }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const { user: currentUser } = useAuth();

    const isOwner = project.ownerId === currentUser.id;
    const isAdmin = currentUser.role === 'ADMIN';

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await usersAPI.getAll();
                setAllUsers(res.data);
            } catch (err) {
                console.error('Failed to fetch users', err);
            }
        };
        fetchUsers();
    }, []);

    const handleAddMember = async (userId) => {
        try {
            await projectsAPI.addMember(project.id, userId);
            onUpdate();
        } catch (err) {
            alert(err.response?.data?.message || 'Ошибка при добавлении участника');
        }
    };

    const handleRemoveMember = async (userId) => {
        if (window.confirm('Удалить участника из проекта?')) {
            try {
                await projectsAPI.removeMember(project.id, userId);
                onUpdate();
            } catch (err) {
                alert(err.response?.data?.message || 'Ошибка при удалении участника');
            }
        }
    };

    const filteredUsers = allUsers.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200, padding: '20px' }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                style={{ backgroundColor: 'var(--bg)', width: '100%', maxWidth: '500px', border: '1px solid var(--border)', padding: '2rem' }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontWeight: '900', fontSize: '1.5rem' }}>УЧАСТНИКИ ПРОЕКТА</h2>
                    <button onClick={onClose} style={{ color: 'var(--text-soft)' }}><X size={24} /></button>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-soft)', marginBottom: '1rem', letterSpacing: '1px' }}>ТЕКУЩИЙ СОСТАВ</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Star size={14} fill="currentColor" />
                                <span style={{ fontWeight: 'bold' }}>{project.ownerUsername}</span>
                            </div>
                            <span style={{ fontSize: '0.6rem', fontWeight: '900', color: 'var(--text-soft)' }}>ВЛАДЕЛЕЦ</span>
                        </div>
                        {project.members && project.members.map(member => (
                            <div key={member.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', border: '1px solid var(--border)' }}>
                                <span style={{ fontWeight: 'bold' }}>{member.username}</span>
                                {(isOwner || isAdmin) && (
                                    <button onClick={() => handleRemoveMember(member.id)} style={{ color: 'var(--text-soft)' }}>
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {(isOwner || isAdmin) && (
                    <div>
                        <h3 style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-soft)', marginBottom: '1rem', letterSpacing: '1px' }}>ДОБАВИТЬ УЧАСТНИКА</h3>
                        <div style={{ position: 'relative', marginBottom: '1rem' }}>
                            <Search style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-soft)' }} size={16} />
                            <input
                                placeholder="Поиск по имени или email..."
                                style={{ width: '100%', padding: '0.8rem 0.8rem 0.8rem 2.5rem', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text)', outline: 'none' }}
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {filteredUsers
                                .filter(u => u.id !== project.ownerId && !project.members?.some(m => m.id === u.id))
                                .map(u => (
                                    <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.8rem', border: '1px solid var(--border)', fontSize: '0.9rem' }}>
                                        <span>{u.username}</span>
                                        <button onClick={() => handleAddMember(u.id)} style={{ color: 'var(--text)' }}>
                                            <UserPlus size={18} />
                                        </button>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default MemberManager;
