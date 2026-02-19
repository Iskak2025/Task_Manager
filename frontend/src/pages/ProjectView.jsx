import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsAPI, tasksAPI } from '../api/api';
import TaskCard from '../components/TaskCard';
import { motion } from 'framer-motion';
import { Plus, ArrowLeft, Users } from 'lucide-react';
import TaskModal from '../components/TaskModal';
import MemberManager from '../components/MemberManager';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const ProjectView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '' });
    const { user: currentUser } = useAuth();

    const fetchData = async () => {
        try {
            const pRes = await projectsAPI.getById(id);
            setProject(pRes.data);
            const tRes = await tasksAPI.getAll(id);
            setTasks(tRes.data);
        } catch (err) {
            console.error(err);
            navigate('/');
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleTaskClick = (task) => {
        setSelectedTask(task);
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await tasksAPI.create(id, { ...newTask, projectId: id });
            setIsTaskModalOpen(false);
            setNewTask({ title: '', description: '', priority: 'MEDIUM', dueDate: '' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            await tasksAPI.updateStatus(id, taskId, newStatus);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const columns = [
        { id: 'TODO', title: 'НУЖНО СДЕЛАТЬ' },
        { id: 'IN_PROGRESS', title: 'В РАБОТЕ' },
        { id: 'DONE', title: 'ГОТОВО' }
    ];

    if (!project) return null;

    return (
        <div className="fade-in">
            <div style={{ marginBottom: '3rem' }}>
                <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontWeight: 'bold', color: 'var(--text-soft)' }}>
                    <ArrowLeft size={16} /> НАЗАД К ПРОЕКТАМ
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ fontSize: '3rem', fontWeight: '900', textTransform: 'uppercase', lineHeight: '1', marginBottom: '1rem' }}>{project.name}</h1>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <p style={{ color: 'var(--text-soft)', fontSize: '1rem', maxWidth: '600px' }}>{project.description}</p>
                            <button
                                onClick={() => setIsMemberModalOpen(true)}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', border: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: '900', backgroundColor: 'var(--surface)' }}
                            >
                                <Users size={16} /> КОМАНДА ({1 + (project.members?.length || 0)})
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsTaskModalOpen(true)}
                        style={{ padding: '1rem 2rem', backgroundColor: 'var(--text)', color: 'var(--bg)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Plus size={20} /> НОВАЯ ЗАДАЧА
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', minHeight: '600px' }}>
                {columns.map(col => {
                    const columnTasks = tasks.filter(t => t.status === col.id);
                    return (
                        <div key={col.id} style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)', padding: '1.5rem' }}>
                            <h2 style={{ fontSize: '0.8rem', fontWeight: '900', marginBottom: '1.5rem', letterSpacing: '1px', paddingBottom: '0.5rem', borderBottom: '2px solid var(--text)' }}>
                                {col.title} ({columnTasks.length})
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {columnTasks.length === 0 ? (
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-soft)', textAlign: 'center', padding: '2rem', border: '1px dashed var(--border)' }}>ПУСТО</p>
                                ) : (
                                    columnTasks.map(task => (
                                        <TaskCard key={task.id} task={task} onStatusChange={updateTaskStatus} onClick={handleTaskClick} />
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <AnimatePresence>
                {selectedTask && (
                    <TaskModal
                        task={selectedTask}
                        projectId={id}
                        onClose={() => setSelectedTask(null)}
                        onUpdate={fetchData}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isMemberModalOpen && (
                    <MemberManager
                        project={project}
                        onClose={() => setIsMemberModalOpen(false)}
                        onUpdate={fetchData}
                    />
                )}
            </AnimatePresence>

            {isTaskModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'var(--bg)', padding: '2.5rem', width: '100%', maxWidth: '500px', border: '1px solid var(--border)' }}>
                        <h2 style={{ marginBottom: '1.5rem', fontWeight: '800' }}>НОВАЯ ЗАДАЧА</h2>
                        <form onSubmit={handleCreateTask}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>НАЗВАНИЕ</label>
                                <input
                                    autoFocus
                                    style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text)' }}
                                    value={newTask.title}
                                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>ОПИСАНИЕ</label>
                                <textarea
                                    style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text)', minHeight: '80px' }}
                                    value={newTask.description}
                                    onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>ПРИОРИТЕТ</label>
                                    <select
                                        style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text)' }}
                                        value={newTask.priority}
                                        onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                                    >
                                        <option value="LOW">НИЗКИЙ</option>
                                        <option value="MEDIUM">СРЕДНИЙ</option>
                                        <option value="HIGH">ВЫСОКИЙ</option>
                                        <option value="CRITICAL">КРИТИЧЕСКИЙ</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>ДЕДЛАЙН</label>
                                    <input
                                        type="date"
                                        style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text)' }}
                                        value={newTask.dueDate}
                                        onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setIsTaskModalOpen(false)} style={{ fontWeight: 'bold' }}>ОТМЕНА</button>
                                <button type="submit" style={{ padding: '0.8rem 2rem', backgroundColor: 'var(--text)', color: 'var(--bg)', fontWeight: 'bold' }}>СОЗДАТЬ</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectView;
