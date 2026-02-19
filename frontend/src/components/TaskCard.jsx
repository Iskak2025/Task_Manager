import React from 'react';
import { motion } from 'framer-motion';
import { Clock, User as UserIcon, ChevronRight } from 'lucide-react';

const TaskCard = ({ task, onStatusChange, onClick }) => {
    const getPriorityColor = (p) => {
        switch (p) {
            case 'CRITICAL': return '#000000';
            case 'HIGH': return '#333333';
            case 'MEDIUM': return '#666666';
            default: return '#999999';
        }
    };

    return (
        <motion.div
            layout
            whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
            onClick={() => onClick(task)}
            style={{
                padding: '1.2rem',
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--border)',
                cursor: 'pointer'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                <span style={{
                    fontSize: '0.6rem',
                    fontWeight: '900',
                    backgroundColor: getPriorityColor(task.priority),
                    color: task.priority === 'CRITICAL' ? 'white' : 'white',
                    padding: '2px 6px',
                    borderRadius: '2px'
                }}>
                    {task.priority}
                </span>
                {task.dueDate && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: 'var(--text-soft)' }}>
                        <Clock size={12} /> {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                )}
            </div>

            <h4 style={{ fontWeight: '800', fontSize: '1rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{task.title}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {task.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--surface)' }}>
                        <UserIcon size={14} />
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>{task.assignee?.username || '—'}</span>
                </div>

                <select
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ fontSize: '0.7rem', padding: '0.2rem', backgroundColor: 'transparent', border: 'none', fontWeight: 'bold', color: 'var(--text)', outline: 'none' }}
                >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">DOING</option>
                    <option value="DONE">DONE</option>
                </select>
            </div>
        </motion.div>
    );
};

export default TaskCard;
