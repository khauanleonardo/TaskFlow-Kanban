import axios from 'axios';

// Na sua máquina: usa 'http://localhost:3001'
// Na Vercel: usa a URL definida na variável de ambiente (VITE_API_URL ou VITE_BASE_URL_API)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL_API || 'http://localhost:3001',
});

// Interceptor de REQUISIÇÃO: Anexa o Bearer Token do usuário logado
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de RESPOSTA: Captura 401 e desloga (exceto na rota de login - UC14 Cap. 7.2)
api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    const ehLogin = erro.config?.url?.includes('/auth/login');
    if (erro.response?.status === 401 && !ehLogin) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(erro);
  }
);

// Tratamento padronizado de erros que extrai mensagens da API do professor
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
