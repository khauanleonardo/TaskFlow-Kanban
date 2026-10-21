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

// Interceptor de RESPOSTA (Passo 2 - Slide 6: 401 do login não redireciona)
api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    // O 401 do PRÓPRIO login é "senha errada": deixa o login.jsx tratar
    const ehLogin = erro.config?.url?.includes('/auth/login');

    if (erro.response?.status === 401 && !ehLogin) {
      // 401 em qualquer outra rota = token inválido ou sessão expirada
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(erro);
  }
);

/**
 * Função para padronizar e extrair a lista de mensagens de erro da API (Passo 1 - Slide 5)
 * @param {Error} erro - Objeto de erro retornado pelo axios
 * @returns {string[]} Lista de mensagens amigáveis
 */
export function mensagensDeErro(erro) {
  const dados = erro.response?.data?.erro;

  // Sem resposta: API fora do ar, URL errada, CORS ou timeout
  if (!dados) {
    return ['Não foi possível conectar à API.'];
  }

  // 400 da validação: uma mensagem por campo (array de detalhes)
  if (dados.detalhes && Array.isArray(dados.detalhes)) {
    return dados.detalhes;
  }

  // Demais erros (401, 404, 500...)
  if (dados.mensagem) {
    return [dados.mensagem];
  }

  return ['Ocorreu um erro inesperado.'];
}

export default api;
