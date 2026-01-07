import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('admin_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth Service
export const authService = {
    login: (credentials) => api.post('/admin/login', credentials),
    logout: () => api.post('/admin/logout'),
    getUser: () => api.get('/admin/user'),
};

// Dashboard Service
export const dashboardService = {
    getStats: () => api.get('/admin/dashboard/stats'),
};

// Book Service
export const bookService = {
    getAll: (page = 1) => api.get(`/admin/books?page=${page}`),
    getOne: (id) => api.get(`/admin/books/${id}`),
    create: (data) => api.post('/admin/books', data),
    update: (id, data) => api.put(`/admin/books/${id}`, data),
    delete: (id) => api.delete(`/admin/books/${id}`),
};

// Category Service
export const categoryService = {
    getAll: (page = 1) => api.get(`/admin/categories?page=${page}`),
    getOne: (id) => api.get(`/admin/categories/${id}`),
    create: (data) => api.post('/admin/categories', data),
    update: (id, data) => api.put(`/admin/categories/${id}`, data),
    delete: (id) => api.delete(`/admin/categories/${id}`),
};

// Order Service
export const orderService = {
    getAll: (page = 1) => api.get(`/admin/orders?page=${page}`),
    getOne: (id) => api.get(`/admin/orders/${id}`),
    update: (id, data) => api.put(`/admin/orders/${id}`, data),
    delete: (id) => api.delete(`/admin/orders/${id}`),
};

export default api;