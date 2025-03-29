import axios from 'axios';

const API_BASE_URL = 'https://reqres.in/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },
};

export const userService = {
  getUsers: async (page = 1) => {
    const response = await api.get(`/users?page=${page}`);
    return response.data;
  },
  
  getUserById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  updateUser: async (id: number, userData: any) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  
  deleteUser: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export default api; 