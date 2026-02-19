import React, { useEffect, useState } from 'react';
import { projectsAPI } from '../api/api';
import ProjectCard from '../components/ProjectCard';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [currentProject, setCurrentProject] = useState({ name: '', description: '' });

    const fetchProjects = async () => {
        try {
            const res = await projectsAPI.getAll();
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalMode === 'create') {
                await projectsAPI.create(currentProject);
            } else {
                await projectsAPI.update(currentProject.id, currentProject);
            }
            setIsModalOpen(false);
            setCurrentProject({ name: '', description: '' });
            fetchProjects();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот проект? Все задачи в нем также будут удалены.')) {
            try {
                await projectsAPI.delete(id);
                fetchProjects();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const openEditModal = (project) => {
        setCurrentProject(project);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setCurrentProject({ name: '', description: '' });
        setModalMode('create');
        setIsModalOpen(true);
    };

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '900' }}>ПРОЕКТЫ</h1>
                <button
                    onClick={openCreateModal}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.8rem 1.5rem',
                        backgroundColor: 'var(--text)',
                        color: 'var(--bg)',
                        fontWeight: 'bold'
                    }}
                >
                    <Plus size={18} /> НОВЫЙ ПРОЕКТ
                </button>
            </div>

            {projects.length === 0 ? (
                <div style={{ padding: '5rem', textAlign: 'center', border: '2px dashed var(--border)', color: 'var(--text-soft)' }}>
                    <p style={{ fontWeight: 'bold' }}>У вас пока нет проектов. Создайте свой первый проект!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            index={index}
                            onDelete={handleDelete}
                            onEdit={openEditModal}
                        />
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'var(--bg)', padding: '2.5rem', width: '100%', maxWidth: '500px', border: '1px solid var(--border)' }}>
                        <h2 style={{ marginBottom: '1.5rem', fontWeight: '800' }}>
                            {modalMode === 'create' ? 'СОЗДАТЬ ПРОЕКТ' : 'РЕДАКТИРОВАТЬ ПРОЕКТ'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>НАЗВАНИЕ</label>
                                <input
                                    autoFocus
                                    style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text)', outline: 'none' }}
                                    value={currentProject.name}
                                    onChange={e => setCurrentProject({ ...currentProject, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>ОПИСАНИЕ</label>
                                <textarea
                                    style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text)', minHeight: '100px', outline: 'none', resize: 'none' }}
                                    value={currentProject.description}
                                    onChange={e => setCurrentProject({ ...currentProject, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ fontWeight: 'bold' }}>ОТМЕНА</button>
                                <button type="submit" style={{ padding: '0.8rem 2rem', backgroundColor: 'var(--text)', color: 'var(--bg)', fontWeight: 'bold' }}>
                                    {modalMode === 'create' ? 'СОЗДАТЬ' : 'СОХРАНИТЬ'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
