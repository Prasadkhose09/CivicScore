import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        try {
            const storedToken = localStorage.getItem('accessToken');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (e) {
            console.error('Failed to parse stored user:', e);
            localStorage.clear();
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        try {
            const response = await authAPI.login(username, password);
            const { accessToken, refreshToken, citizenId } = response;

            // Decode JWT to get role (simple decode - not validation)
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            const role = payload.role || (username === 'admin' ? 'ADMIN' : 'CITIZEN');

            const userData = {
                username,
                role,
                citizenId, // ID returned from DB
            };

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(userData));

            setToken(accessToken);
            setUser(userData);

            return { success: true, role };
        } catch (error) {
            console.error('Login failed:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            return {
                success: false,
                error: error.response?.data?.message || 'Connection to server failed. Please check if the backend is running.'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!token;
    const isAdmin = user?.role === 'ADMIN';
    const isCitizen = user?.role === 'CITIZEN';

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        isCitizen,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
