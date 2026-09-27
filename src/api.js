// src/api.js
import axios from 'axios';

// URL base automática: usa VITE_API_URL se existir, URL de produção se em build, ou localhost
const urlBase =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://taskflow-api-ruby.vercel.app'
    : 'http://localhost:3001');

const api = axios.create({
  baseURL: urlBase.replace(/\/$/, '')
});

// Interceptor de REQUISIÇÃO (Injeta o Bearer Token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de RESPOSTA (Captura 401 globalmente)
api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    if (erro.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(erro);
  }
);

export default api;
