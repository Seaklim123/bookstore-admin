import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            try {
                const response = await authService.getUser();
                setUser(response.data);
            } catch (error) {
                localStorage.removeItem('admin_token');
            }
        }
        setLoading(false);
    };

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            localStorage.setItem('admin_token', response.data.token);
            setUser(response.data.user);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('admin_token');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const login = async ({ email, password }) => {
  return await axios.post('http://localhost:8000/api/admin/login', { email, password });
};