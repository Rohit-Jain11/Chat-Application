import axios from 'axios';

// Determine base URL based on environment
const isDevelopment = import.meta.env.MODE === 'development';
const BASE_URL = isDevelopment 
  ? 'http://localhost:5000/api'  // Direct connection in development
  : '/api';                      // Relative path in production

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Request interceptor
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem('token');
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making API request to:', req.url);
    return req;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    console.log('API response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API error:', error.response?.status, error.config?.url, error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running on localhost:5000');
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get('/auth/me'),
  searchUsers: (search) => API.get(`/auth/search?search=${search}`),
};

// Chat APIs
export const chatAPI = {
  getChats: () => API.get('/chat'),
  accessChat: (userId) => API.post('/chat', { userId }),
  createGroup: (data) => API.post('/chat/group', data),
  renameGroup: (data) => API.put('/chat/rename', data),
  addToGroup: (data) => API.put('/chat/groupadd', data),
  removeFromGroup: (data) => API.put('/chat/groupremove', data),
};

// Message APIs
export const messageAPI = {
  getMessages: (chatId) => API.get(`/message/${chatId}`),
  sendMessage: (data) => API.post('/message', data),
};

// Health check
export const healthCheck = () => API.get('/health');

export default API;