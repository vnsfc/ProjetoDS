import axios from 'axios';
import { useAuthStore } from '../stores/AuthStores';

// VITE_API_URL define o endereço do backend.
// VITE_API_BASE_PATH define um prefixo de rota opcional (ex: "/ho" quando atrás do Nginx em produção/Docker).
// Em desenvolvimento local, deixe VITE_API_BASE_PATH vazio ou não defina — assim as rotas batem direto em /auth, /usuarios, etc.
const envUrl = import.meta.env.VITE_API_URL || '';
const basePath = import.meta.env.VITE_API_BASE_PATH || '';
const finalBaseURL = envUrl.replace(/\/$/, '') + basePath;

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