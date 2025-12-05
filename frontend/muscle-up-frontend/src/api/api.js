import axios from 'axios';
import { workouts as mockWorkouts } from '../mocks/workouts';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

const safeGet = async (url) => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (err) {
    console.warn(`Backend não disponível, usando mock para ${url}`);
    if (url === '/feed') return mockWorkouts;
    return [];
  }
};

const safePost = async (url, data) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (err) {
    console.warn(`Backend não disponível, requisição POST mock ignorada para ${url}`);
    return { success: false };
  }
};

export default {
  get: safeGet,
  post: safePost,
};
