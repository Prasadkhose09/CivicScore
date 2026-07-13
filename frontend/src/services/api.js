import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://16.192.90.138:8080';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed error for debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
};

// Dashboard API (Admin)
export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },
};

// Citizens API
export const citizensAPI = {
  create: async (name) => {
    const response = await api.post(`/citizens?name=${encodeURIComponent(name)}`);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/citizens');
    return response.data;
  },
  getById: async (citizenId) => {
    const response = await api.get(`/citizens/${citizenId}`);
    return response.data;
  },
  getScore: async (citizenId) => {
    const response = await api.get(`/citizens/${citizenId}/score`);
    return response.data;
  },
};

// Violations API
export const violationsAPI = {
  add: async (citizenId, severity, description) => {
    const response = await api.post(
      `/violations?citizenId=${citizenId}&severity=${severity}&description=${encodeURIComponent(description)}`
    );
    return response.data;
  },
  getByCitizen: async (citizenId) => {
    const response = await api.get(`/violations/citizen/${citizenId}`);
    return response.data;
  },
};

// Appeals API
export const appealsAPI = {
  raise: async (violationId, reason) => {
    const response = await api.post(
      `/appeals?violationId=${violationId}&reason=${encodeURIComponent(reason)}`
    );
    return response.data;
  },
  resolve: async (appealId, status) => {
    const response = await api.put(`/appeals/${appealId}?status=${status}`);
    return response.data;
  },
  getPending: async () => {
    const response = await api.get('/appeals/pending');
    return response.data;
  },
  getByCitizen: async (citizenId) => {
    const response = await api.get(`/appeals/citizen/${citizenId}`);
    return response.data;
  },
};

// Score History API
export const scoreHistoryAPI = {
  getHistory: async (citizenId) => {
    const response = await api.get(`/score-history/${citizenId}`);
    return response.data;
  },
};

// Incentives API
export const incentivesAPI = {
  getIncentives: async (citizenId) => {
    const response = await api.get(`/incentives/${citizenId}`);
    return response.data;
  },
};

// Notifications API
export const notificationsAPI = {
  getNotifications: async (citizenId) => {
    const response = await api.get(`/notifications/${citizenId}`);
    return response.data;
  },
  getUnreadCount: async (citizenId) => {
    const response = await api.get(`/notifications/${citizenId}/unread-count`);
    return response.data;
  },
  markAsRead: async (notificationId) => {
    const response = await api.post(`/notifications/${notificationId}/read`);
    return response.data;
  },
};

// Challenges API
export const challengesAPI = {
  getAvailable: async () => {
    const response = await api.get('/challenges');
    return response.data;
  },
  getMy: async (citizenId) => {
    const response = await api.get(`/challenges/my/${citizenId}`);
    return response.data;
  },
  join: async (challengeId, citizenId) => {
    const response = await api.post(`/challenges/${challengeId}/join/${citizenId}`);
    return response.data;
  },
  complete: async (challengeId, citizenId) => {
    const response = await api.post(`/challenges/${challengeId}/complete/${citizenId}`);
    return response.data;
  },
};

// Audit Logs API
export const auditLogsAPI = {
  getAll: async () => {
    const response = await api.get('/admin/audit-logs');
    return response.data;
  },
};

export default api;
