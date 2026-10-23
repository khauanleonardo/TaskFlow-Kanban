import axios from 'axios';

// Na sua máquina: usa 'http://localhost:3001'.
// Na Vercel: usa a URL definida nas configurações (VITE_API_URL).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
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

// Tratamento padronizado de erros ensinado pelo professor (UC14)
export function mensagensDeErro(erro) {
  const dados = erro.response?.data?.erro;

  if (!dados) {
    if (erro.message) return [erro.message];
    return ['Não foi possível conectar à API.'];
  }

  if (dados.detalhes && Array.isArray(dados.detalhes)) {
    return dados.detalhes;
  }

  if (dados.mensagem) {
    return [dados.mensagem];
  }

  return ['Ocorreu um erro ao processar a requisição.'];
}

export default api;
