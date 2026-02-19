import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Trash2, Clock, AlertCircle } from 'lucide-react';
import { commentsAPI, tasksAPI, projectsAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';

const TaskModal = ({ task: initialTask, projectId, onClose, onUpdate }) => {
    const [task, setTask] = useState(initialTask);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [projectMembers, setProjectMembers] = useState([]);
    const [ownerId, setOwnerId] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        setTask(initialTask);
    }, [initialTask]);

    const fetchComments = async () => {
        try {
            const res = await commentsAPI.getAll(task.id);
            setComments(res.data);
        } catch (err) {
            console.error('Failed to fetch comments', err);
        }
    };

    const fetchProjectDetails = async () => {
        try {
            const res = await projectsAPI.getById(projectId);
            setOwnerId(res.data.ownerId);
            const members = res.data.memberIds || [];
            // We need to fetch usernames for members if they aren't in the DTO
            // For now, let's use the usersAPI to get all users or at least simplify
            const allUsersRes = await usersAPI.getAll();
            const projectMemberUsers = allUsersRes.data.filter(u =>
                members.includes(u.id) || u.id === res.data.ownerId
            );
            setProjectMembers(projectMemberUsers);
        } catch (err) {
            console.error('Failed to fetch project details', err);
        }
    }

    useEffect(() => {
        if (task && task.id) {
            fetchComments();
            fetchProjectDetails();
        }
    }, [task?.id]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await commentsAPI.create(task.id, { text: newComment, taskId: task.id });
            setNewComment('');
            fetchComments();
        } catch (err) {
            console.error('Failed to add comment', err);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await commentsAPI.delete(task.id, commentId);
            fetchComments();
        } catch (err) {
            console.error('Failed to delete comment', err);
        }
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        try {
            const res = await tasksAPI.update(projectId, task.id, task);
            setTask(res.data);
            setIsEditing(false);
            onUpdate();
        } catch (err) {
            console.error('Failed to update task', err);
        }
    };

    const handleUpdateAssignee = async (userId) => {
        try {
            // Using update instead of assignAssignee to handle null/unassign correctly
            await tasksAPI.update(projectId, task.id, { assigneeId: userId });
            onUpdate();
        } catch (err) {
            alert('Ошибка при изменении исполнителя');
        }
    };

    const handleDeleteTask = async () => {
        if (window.confirm('Удалить эту задачу?')) {
            try {
                await tasksAPI.delete(projectId, task.id);
                onUpdate();
                onClose();
            } catch (err) {
                console.error('Failed to delete task', err);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, padding: '20px' }}
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                style={{ backgroundColor: 'var(--bg)', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border)', position: 'relative' }}
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--text-soft)', zIndex: 10 }}>
                    <X size={24} />
                </button>

                <div style={{ padding: '3rem' }}>
                    <form onSubmit={handleUpdateTask}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                {isEditing ? (
                                    <select
                                        value={task.priority}
                                        onChange={e => setTask({ ...task, priority: e.target.value })}
                                        style={{ fontSize: '0.7rem', fontWeight: '900', padding: '4px 8px', border: '1px solid var(--text)', backgroundColor: 'var(--surface)', color: 'var(--text)', textTransform: 'uppercase' }}
                                    >
                                        <option value="LOW">НИЗКИЙ</option>
                                        <option value="MEDIUM">СРЕДНИЙ</option>
                                        <option value="HIGH">ВЫСОКИЙ</option>
                                        <option value="CRITICAL">КРИТИЧЕСКИЙ</option>
                                    </select>
                                ) : (
                                    <span style={{ fontSize: '0.7rem', fontWeight: '900', padding: '4px 8px', border: '1px solid var(--text)', textTransform: 'uppercase' }}>
                                        {task.priority}
                                    </span>
                                )}
                                <span style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-soft)' }}>
                                    {task.status.replace('_', ' ')}
                                </span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-soft)' }}>
                                    СОЗДАНО: {new Date(task.createdAt).toLocaleString()}
                                </span>
                            </div>
                            {!isEditing && (user.id === task.creator?.id || user.id === ownerId || user.role === 'ADMIN') && (
                                <button type="button" onClick={() => setIsEditing(true)} style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-soft)', textDecoration: 'underline' }}>
                                    РЕДАКТИРОВАТЬ
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <input
                                autoFocus
                                value={task.title}
                                onChange={e => setTask({ ...task, title: e.target.value })}
                                style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1.5rem', textTransform: 'uppercase', width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '2px solid var(--text)', color: 'var(--text)', outline: 'none' }}
                                required
                            />
                        ) : (
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1.5rem', textTransform: 'uppercase', lineHeight: '1' }}>
                                {task.title}
                            </h2>
                        )}

                        {isEditing ? (
                            <textarea
                                value={task.description}
                                onChange={e => setTask({ ...task, description: e.target.value })}
                                style={{ fontSize: '1.1rem', color: 'var(--text-soft)', marginBottom: '2rem', lineHeight: '1.6', width: '100%', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', padding: '1rem', outline: 'none', minHeight: '100px' }}
                            />
                        ) : (
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-soft)', marginBottom: '2rem', lineHeight: '1.6' }}>
                                {task.description || 'Нет описания'}
                            </p>
                        )}

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '3rem', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={16} />
                                {isEditing ? (
                                    <input
                                        type="date"
                                        value={task.dueDate ? task.dueDate.split('T')[0] : ''}
                                        onChange={e => setTask({ ...task, dueDate: e.target.value })}
                                        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', padding: '4px', outline: 'none' }}
                                    />
                                ) : (
                                    task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'БЕЗ ДЕДЛАЙНА'
                                )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <AlertCircle size={16} />
                                <select
                                    value={task.assignee?.id || ''}
                                    onChange={(e) => {
                                        const newId = e.target.value;
                                        if (isEditing) {
                                            const member = projectMembers.find(m => m.id === (newId ? parseInt(newId) : null));
                                            setTask({ ...task, assignee: member || null });
                                        } else {
                                            handleUpdateAssignee(newId ? parseInt(newId) : null);
                                        }
                                    }}
                                    style={{ backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', color: 'var(--text)', outline: 'none', fontWeight: 'bold' }}
                                >
                                    <option value="" style={{ backgroundColor: 'var(--surface)' }}>БЕЗ ИСПОЛНИТЕЛЯ</option>
                                    {projectMembers.map(m => (
                                        <option key={m.id} value={m.id} style={{ backgroundColor: 'var(--surface)' }}>{m.username.toUpperCase()}</option>
                                    ))}
                                </select>
                                (ИСПОЛНИТЕЛЬ)
                            </div>
                        </div>

                        {isEditing && (
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                                <button type="button" onClick={() => { setIsEditing(false); setTask(initialTask); }} style={{ padding: '0.8rem 1.5rem', border: '1px solid var(--border)', fontWeight: 'bold' }}>ОТМЕНА</button>
                                <button type="submit" style={{ padding: '0.8rem 1.5rem', backgroundColor: 'var(--text)', color: 'var(--bg)', fontWeight: 'bold' }}>СОХРАНИТЬ ИЗМЕНЕНИЯ</button>
                            </div>
                        )}
                    </form>

                    <div style={{ borderTop: '2px solid var(--text)', paddingTop: '2rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '1.5rem' }}>КОММЕНТАРИИ ({comments.length})</h3>

                        <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                            <input
                                placeholder="Напишите комментарий..."
                                style={{ flex: 1, padding: '1rem', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text)', outline: 'none' }}
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                            />
                            <button style={{ padding: '1rem', backgroundColor: 'var(--text)', color: 'var(--bg)', fontWeight: 'bold' }}>
                                <Send size={20} />
                            </button>
                        </form>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {comments.map(comment => (
                                <div key={comment.id} style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'baseline' }}>
                                            <span style={{ fontWeight: '900', fontSize: '0.8rem' }}>{comment.authorUsername.toUpperCase()}</span>
                                            <span style={{ fontSize: '0.65rem', color: 'var(--text-soft)' }}>{new Date(comment.createdAt).toLocaleString()}</span>
                                        </div>
                                        {(user?.id === comment.authorId || user?.role === 'ADMIN') && (
                                            <button onClick={() => handleDeleteComment(comment.id)} style={{ color: 'var(--text-soft)' }}>
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                    <p style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{comment.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {(user.id === task.creator?.id || user.id === ownerId || user.role === 'ADMIN') && (
                        <button
                            onClick={handleDeleteTask}
                            style={{ marginTop: '3rem', color: '#ff4444', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #ff4444', padding: '0.8rem 1.5rem' }}
                        >
                            <Trash2 size={16} /> УДАЛИТЬ ЗАДАЧУ
                        </button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TaskModal;
