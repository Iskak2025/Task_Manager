import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Trash2, Edit } from 'lucide-react';

const ProjectCard = ({ project, index, onDelete, onEdit }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            style={{
                padding: '2rem',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '240px',
                position: 'relative'
            }}
        >
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.8rem' }}>
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(project); }}
                    style={{ color: 'var(--text-soft)', padding: '4px' }}
                >
                    <Edit size={16} />
                </button>
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(project.id); }}
                    style={{ color: 'var(--text-soft)', padding: '4px' }}
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.8rem', textTransform: 'uppercase', paddingRight: '40px' }}>{project.name}</h3>
                <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', lineHeight: '1.4', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {project.description}
                </p>
            </div>

            <Link
                to={`/projects/${project.id}`}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    marginTop: '1rem',
                    borderBottom: '1px solid var(--text)',
                    width: 'max-content',
                    paddingBottom: '2px'
                }}
            >
                ОТКРЫТЬ <ArrowRight size={14} />
            </Link>
        </motion.div>
    );
};

export default ProjectCard;
