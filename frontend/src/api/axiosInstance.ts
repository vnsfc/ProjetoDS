import axios from 'axios';
import { useAuthStore } from '../stores/AuthStores';

const envUrl = import.meta.env.VITE_API_URL || '';
const finalBaseURL = envUrl.replace(/\/$/, '') + '/ho';

const axiosInstance = axios.create({
  // Vazio usa o proxy do Vite; VITE_API_URL permite apontar para outro backend.
  baseURL: finalBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar o Token em todas as requisições
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para capturar erros globais (como 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
