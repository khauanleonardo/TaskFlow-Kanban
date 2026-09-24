import axios from 'axios';



// 1. Se tiver VITE_API_URL no .env, usa ele.

// 2. Se estiver rodando na Vercel (PROD), usa a API da nuvem.

// 3. Se estiver na máquina local, usa http://localhost:3001.

const urlBase =

  import.meta.env.VITE_API_URL ||

  (import.meta.env.PROD

    ? 'https://taskflow-api-ruby.vercel.app'

    : 'http://localhost:3001');



// Remove barra no final caso tenha sido digitada

const baseURL = urlBase.replace(/\/$/, '');



const api = axios.create({

  baseURL,

});



// Interceptor de REQUISIÇÃO (Injeta o Token JWT)

api.interceptors.request.use((config) => {

  const token = localStorage.getItem('token');

  if (token) {

    config.headers.Authorization = `Bearer ${token}`;

  }

  return config;

});



// Interceptor de RESPOSTA (Captura 401 e desloga)

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