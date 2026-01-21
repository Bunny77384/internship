import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    register: (data) => api.post('/api/auth/register', data),
    login: (data) => api.post('/api/auth/login', data),
    getProfile: () => api.get('/api/auth/profile')
};

// Internship APIs
export const internshipAPI = {
    getAll: () => api.get('/api/internships'),
    getOne: (id) => api.get(`/api/internships/${id}`),
    create: (data) => api.post('/api/internships', data),
    update: (id, data) => api.put(`/api/internships/${id}`, data),
    delete: (id) => api.delete(`/api/internships/${id}`),
    getStats: () => api.get('/api/internships/stats')
};

// Upload APIs
export const uploadAPI = {
    uploadFile: (formData) => {
        return api.post('/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    getFiles: () => api.get('/api/upload/files'),
    deleteFile: (filename) => api.delete(`/api/upload/${filename}`)
};

// Interview APIs
export const interviewAPI = {
    getAll: () => api.get('/api/interviews'),
    saveVideo: (data) => api.post('/api/interviews', data)
};

export default api;
