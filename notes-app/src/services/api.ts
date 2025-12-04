import axios from 'axios';
import { User, Note } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('API URL configured:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });
    return Promise.reject(error);
  }
);

export const userAPI = {
  login: async (username: string): Promise<{ user: User }> => {
    const response = await api.post('/users/login', { username });
    return response.data;
  },
};

export const notesAPI = {
  getNotes: async (): Promise<Note[]> => {
    const response = await api.get('/notes');
    return response.data;
  },

  createNote: async (title: string): Promise<Note> => {
    const response = await api.post('/notes', { title });
    return response.data;
  },

  updateNote: async (id: string, updates: Partial<Note>): Promise<Note> => {
    const response = await api.put(`/notes/${id}`, updates);
    return response.data;
  },

  deleteNote: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },

  searchNotes: async (query: string): Promise<Note[]> => {
    const response = await api.get('/notes/search', { params: { q: query } });
    return response.data;
  },
};

export default api;
