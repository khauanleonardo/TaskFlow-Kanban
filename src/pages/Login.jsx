import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Workflow, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);
  const [erro, setErro] = useState('');
  const [shake, setShake] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // Dispara a animação de tremor e limpa após 500ms
  function dispararShake() {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setErro('');

    const emailLimpo = email.trim();
    const senhaLimpa = senha.trim();

    // 1. Validação local: campos vazios
    if (!emailLimpo || !senhaLimpa) {
      setErro('Informe e-mail e senha.');
      dispararShake();
      return;
    }

    setCarregando(true);

    try {
      // 2. Chamada real à API Node.js
      const resposta = await api.post('/auth/login', {
        email: emailLimpo,
        senha: senhaLimpa
      });

      const { token, usuario } = resposta.data;

      // Salva no contexto e localStorage
      login(usuario, token);

      if (lembrar) {
        localStorage.setItem('@TaskFlow:lembrarEmail', emailLimpo);
      } else {
        localStorage.removeItem('@TaskFlow:lembrarEmail');
      }

      // Redireciona para o Kanban
      navigate('/', { replace: true });
    } catch (err) {
      // 3. Captura tanto 'erro' quanto 'mensagem' do backend da API
      const mensagemApi =
        err.response?.data?.erro ||
        err.response?.data?.mensagem ||
        'Credenciais inválidas';

      setErro(mensagemApi);
      dispararShake();
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-tela">
      <form onSubmit={handleLogin} className={`login-caixa ${shake ? 'shake' : ''}`}>
        {/* Topo / Logo */}
        <div className="login-topo">
          <div className="login-logo-icone">
            <Workflow size={28} />
          </div>
          <h1>TaskFlow</h1>
          <p>Entre para gerenciar suas tarefas</p>
        </div>

        {/* Formulário */}
        <div className="login-corpo">
          <div className="campo-grupo">
            <label htmlFor="email">E-mail</label>
            <div className="input-com-icone">
              <Mail className="icone-input" size={18} />
              <input
                id="email"
                type="email"
                placeholder="admin@taskflow.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="campo-grupo">
            <label htmlFor="senha">Senha</label>
            <div className="input-com-icone">
              <Lock className="icone-input" size={18} />
              <input
                id="senha"
                type="password"
                placeholder="••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Opção Lembrar */}
          <div className="login-lembrar">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={lembrar}
                onChange={(e) => setLembrar(e.target.checked)}
              />
              Salvar login e senha neste navegador
            </label>
          </div>

          {/* Mensagem de Erro com estilo garantido */}
          {erro && (
            <div
              className="login-erro"
              style={{
                backgroundColor: 'rgba(255, 80, 101, 0.15)',
                color: '#ff5065',
                border: '1px solid rgba(255, 80, 101, 0.35)',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '16px',
                textAlign: 'center',
                animation: 'fadeIn 0.2s ease-in-out'
              }}
            >
              {erro}
            </div>
          )}

          {/* Botão Entrar com Spinner */}
          <button type="submit" className="btn-entrar" disabled={carregando}>
            {carregando ? (
              <span className="spinner-box">
                <Loader2 className="spinner" size={18} />
                Entrando...
              </span>
            ) : (
              'Entrar'
            )}
          </button>
        </div>

        {/* Rodapé com as credenciais padrão */}
        <div className="login-rodape">
          Acesso de demonstração: <strong>admin@taskflow.com</strong> / senha <strong>1234</strong>
        </div>
      </form>
    </div>
  );
}
