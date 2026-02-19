import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
};

// Projects API
export const projectsAPI = {
    getAll: () => api.get('/projects/get_all'),
    getById: (id) => api.get(`/projects/get_project/${id}`),
    create: (data) => api.post('/projects/create', data),
    update: (id, data) => api.put(`/projects/update/${id}`, data, { headers: { 'Content-Type': 'application/json' } }),
    delete: (id) => api.delete(`/projects/delete/${id}`),
    addMember: (projectId, userId) => api.post(`/projects/${projectId}/add_members/${userId}`, {}, { headers: { 'Content-Type': 'application/json' } }),
    removeMember: (projectId, userId) => api.delete(`/projects/${projectId}/members/${userId}`),
};

// Tasks API
export const tasksAPI = {
    getAll: (projectId) => api.get(`/projects/${projectId}/tasks/get_all`),
    create: (projectId, data) => api.post(`/projects/${projectId}/tasks/create`, data),
    updateStatus: (projectId, taskId, status) => api.patch(`/projects/${projectId}/tasks/update_status/${taskId}`, status, { headers: { 'Content-Type': 'application/json' } }),
    update: (projectId, taskId, data) => api.put(`/projects/${projectId}/tasks/update/${taskId}`, data, { headers: { 'Content-Type': 'application/json' } }),
    assignAssignee: (projectId, taskId, userId) => api.patch(`/projects/${projectId}/tasks/${taskId}/assignee/${userId}`, { userId }, { headers: { 'Content-Type': 'application/json' } }),
    delete: (projectId, taskId) => api.delete(`/projects/${projectId}/tasks/delete/${taskId}`),
};

// Comments API
export const commentsAPI = {
    getAll: (taskId) => api.get(`/tasks/${taskId}/comments/get_all`),
    create: (taskId, data) => api.post(`/tasks/${taskId}/comments/create`, data),
    update: (taskId, commentId, data) => api.put(`/tasks/${taskId}/comments/update/${commentId}`, data, { headers: { 'Content-Type': 'application/json' } }),
    delete: (taskId, commentId) => api.delete(`/tasks/${taskId}/comments/delete/${commentId}`),
};

// Users API
export const usersAPI = {
    getCurrentUser: () => api.get('/users/me'),
    getAll: () => api.get('/users/get_all'),
    getById: (id) => api.get(`/users/${id}`),
};

export default api;
