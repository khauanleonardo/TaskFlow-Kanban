import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

export default function Login() {
  const [email, setEmail] = useState('admin@taskflow.com');
  const [senha, setSenha] = useState('1234');
  const [erro, setErro] = useState('');
  const [shake, setShake] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setErro('');

    try {
      setCarregando(true);
      const resposta = await api.post('/auth/login', { email, senha });
      const { token, usuario } = resposta.data;

      login(usuario, token);
      navigate('/');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao conectar à API');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-container">
      <div className={`login-card ${shake ? 'shake' : ''}`}>
        <div className="login-header">
          <h2>TaskFlow</h2>
          <p>Faça login para gerenciar suas tarefas</p>
        </div>

        {erro && <div className="erro-alerta">{erro}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>E-mail ou Usuário</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@taskflow.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="1234"
              required
            />
          </div>

          <button type="submit" className="btn-entrar" disabled={carregando}>
            {carregando ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>
        </form>

        <div className="login-dica">
          <small>Credenciais de teste: <strong>admin@taskflow.com</strong> / <strong>1234</strong></small>
        </div>
      </div>
    </div>
  );
}
