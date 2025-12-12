import axios from 'axios';
import { workouts as mockWorkouts } from '../mocks/workouts';


const API_URL = import.meta.env.VITE_API_URL || 
                'https://body-progress-hub.onrender.com' || 
                'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

const safeGet = async (url) => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (err) {
    console.warn(`Backend não disponível, usando mock para ${url}`);
    if (url === '/feed') return mockWorkouts;
    if (url === '/users/me') return null;
    return [];
  }
};

const safePost = async (url, data) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (err) {
    console.warn(`Backend não disponível, requisição POST mock ignorada para ${url}`);
    
    if (url === '/auth/login' && data.email && data.senha) {
      return { 
        access_token: 'mock_token_' + Date.now(),
        user: { id: 1, name: data.email.split('@')[0], email: data.email }
      };
    }
    if (url === '/auth/register' && data.email) {
      return { id: Date.now(), name: data.nome, email: data.email };
    }
    
    return { success: false };
  }
};


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default {
  get: safeGet,
  post: safePost,
};