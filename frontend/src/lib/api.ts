import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
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
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/api/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  
  logout: () => api.post('/api/auth/logout'),
  
  getMe: () => api.get('/api/auth/me'),
};

// Profile API
export const profileAPI = {
  updateProfile: (data: any) => api.put('/api/profiles', data),
  
  uploadPicture: (file: File) => {
    const formData = new FormData();
    formData.append('picture', file);
    return api.post('/api/profiles/picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  removePicture: () => api.delete('/api/profiles/picture'),
};

// Hashtags API
export const hashtagsAPI = {
  getAll: () => api.get('/api/hashtags'),
  
  getByCategory: (category: string) => 
    api.get(`/api/hashtags/category/${category}`),
  
  getPopular: () => api.get('/api/hashtags/popular'),
  
  search: (query: string) => 
    api.get('/api/hashtags/search', { params: { q: query } }),
};

// Discovery API
export const discoveryAPI = {
  getProfiles: (params?: any) => 
    api.get('/api/discovery', { params }),
  
  getProfile: (userId: string) => 
    api.get(`/api/discovery/profile/${userId}`),
};

// Connections API
export const connectionsAPI = {
  sendRequest: (data: { addresseeId: string; message?: string }) =>
    api.post('/api/connections', data),
  
  updateRequest: (id: string, status: 'accepted' | 'declined') =>
    api.put(`/api/connections/${id}`, { status }),
  
  getConnections: () => api.get('/api/connections'),
};

export default api; 