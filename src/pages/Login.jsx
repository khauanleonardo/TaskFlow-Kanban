import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import { 
  Workflow, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  UserCheck,
  GraduationCap,
  CheckCircle2,
  ShieldCheck,
  Activity,
  Sparkles
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [capsLockAtivo, setCapsLockAtivo] = useState(false);
  const [animarShake, setAnimarShake] = useState(false);
  const [lembrarMe, setLembrarMe] = useState(true);
  const [campoFocado, setCampoFocado] = useState(null); // 'email' | 'senha' | null

  // Posição do mouse para o efeito de iluminação dinâmica no fundo
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const { login } = useAuth();
  const navigate = useNavigate();

  // Atualiza posição do mouse de forma suave
  function handleMouseMove(e) {
    const x = Math.round((e.clientX / window.innerWidth) * 100);
    const y = Math.round((e.clientY / window.innerHeight) * 100);
    setMousePos({ x, y });
  }

  // Validação dinâmica do formato de e-mail
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Monitoramento da tecla Caps Lock
  function verificarCapsLock(e) {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockAtivo(true);
    } else {
      setCapsLockAtivo(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !senha) {
      dispararErro('Preencha seu e-mail e sua senha para continuar.');
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      const resposta = await api.post('/auth/login', { email, senha });
      const token = resposta.data.token;
      const usuario = resposta.data.usuario || resposta.data.user || { nome: 'Khauan Leonardo', email };

      if (token) {
        setSucesso(true);
        login(usuario, token);
        setTimeout(() => {
          navigate('/');
        }, 750);
      } else {
        dispararErro('Resposta da API sem token de validação.');
      }
    } catch (err) {
      const msg = err.response?.data?.mensagem || err.response?.data?.erro;
      dispararErro(msg || 'Credenciais inválidas ou servidor indisponível.');
    } finally {
      setCarregando(false);
    }
  }

  function dispararErro(mensagem) {
    setErro(mensagem);
    setAnimarShake(true);
    setTimeout(() => setAnimarShake(false), 450);
  }

  return (
    <div 
      onMouseMove={handleMouseMove}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0c0c12',
        backgroundImage: `
          radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(65, 214, 134, 0.15) 0%, transparent 45%),
          radial-gradient(circle at 85% 15%, rgba(129, 140, 248, 0.08) 0%, transparent 40%),
          radial-gradient(circle at 15% 85%, rgba(246, 195, 48, 0.06) 0%, transparent 40%)
        `,
        transition: 'background-image 0.15s ease-out',
        padding: '1.5rem',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >

      {/* Animações CSS personalizadas */}
      <style>{`
        @keyframes loginFadeScale {
          from { opacity: 0; transform: translateY(18px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes erroTremor {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-9px); }
          40%, 80% { transform: translateX(9px); }
        }
        @keyframes animacaoOlho {
          0% { transform: scale(0.8) rotate(-15deg); }
          50% { transform: scale(1.2) rotate(15deg); }
          100% { transform: scale(1) rotate(0); }
        }
        @keyframes popIconeCheck {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.3); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulsoBadge {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.2); opacity: 0.4; }
        }
        @keyframes brilhoBotaoShimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes flutuarOrbe {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(25px, -30px) scale(1.1); }
        }

        .anim-tremor {
          animation: erroTremor 0.4s ease-in-out;
        }
        .campo-caixa {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .campo-caixa:focus-within {
          border-color: #41d686 !important;
          box-shadow: 0 0 18px rgba(65, 214, 134, 0.25) !important;
          background: #171724 !important;
        }
        .btn-toggle-olho {
          transition: transform 0.2s ease, color 0.2s ease;
        }
        .btn-toggle-olho:hover {
          color: #41d686 !important;
          transform: scale(1.15);
        }
        .anim-olho-rotacionar {
          animation: animacaoOlho 0.28s ease-out;
        }
        .btn-login-principal {
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
        }
        .btn-login-principal:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(65, 214, 134, 0.4) !important;
          filter: brightness(1.05);
        }
        .btn-login-principal:active:not(:disabled) {
          transform: translateY(0);
        }
        .btn-login-principal::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
          transform: skewX(-20deg);
        }
        .btn-login-principal:hover::after {
          animation: brilhoBotaoShimmer 1.1s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* Orbes de iluminação decorativa flutuante */}
      <div style={{
        position: 'absolute',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(65, 214, 134, 0.08) 0%, transparent 70%)',
        top: '10%',
        left: '15%',
        animation: 'flutuarOrbe 8s infinite ease-in-out',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        width: '280px',
        height: '280px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(129, 140, 248, 0.06) 0%, transparent 70%)',
        bottom: '12%',
        right: '15%',
        animation: 'flutuarOrbe 10s infinite ease-in-out reverse',
        pointerEvents: 'none'
      }} />

      {/* Card Dark Obsidian */}
      <div 
        className={animarShake ? 'anim-tremor' : ''}
        style={{
          width: '100%',
          maxWidth: '430px',
          background: 'rgba(18, 18, 26, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: erro ? '1px solid #ff5065' : '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '18px',
          padding: '2.4rem 2.1rem',
          boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.8), 0 0 35px rgba(65, 214, 134, 0.06)',
          animation: 'loginFadeScale 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          position: 'relative'
        }}
      >

        {/* Badge superior: Status da API */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1.4rem'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.3rem 0.75rem',
            background: 'rgba(65, 214, 134, 0.08)',
            border: '1px solid rgba(65, 214, 134, 0.22)',
            borderRadius: '20px',
            fontSize: '0.74rem',
            color: '#41d686',
            fontWeight: 500
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#41d686',
              boxShadow: '0 0 8px #41d686',
              animation: 'pulsoBadge 2s infinite ease-in-out'
            }} />
            <span>Sistema Online • v1.0</span>
          </div>
        </div>

        {/* Marca do TaskFlow com Reação Animada de Foco */}
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: campoFocado === 'senha' ? 'rgba(129, 140, 248, 0.14)' : 'rgba(65, 214, 134, 0.12)',
            border: campoFocado === 'senha' ? '1px solid rgba(129, 140, 248, 0.45)' : '1px solid rgba(65, 214, 134, 0.35)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: campoFocado === 'senha' ? '#818cf8' : '#41d686',
            marginBottom: '0.8rem',
            transition: 'all 0.3s ease',
            boxShadow: campoFocado === 'senha' ? '0 0 20px rgba(129, 140, 248, 0.3)' : '0 0 20px rgba(65, 214, 134, 0.2)'
          }}>
            {campoFocado === 'senha' ? <ShieldCheck size={28} /> : <Workflow size={28} />}
          </div>

          <h2 style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            Acessar TaskFlow
          </h2>
          <p style={{ color: '#8e8ea0', fontSize: '0.84rem', marginTop: '0.35rem', marginBottom: 0 }}>
            Gerenciador Ágil de Tarefas • UC12
          </p>
        </div>

        {/* Notificação de Erro */}
        {erro && (
          <div style={{
            background: 'rgba(255, 80, 101, 0.12)',
            border: '1px solid rgba(255, 80, 101, 0.4)',
            color: '#ff5065',
            padding: '0.7rem 0.9rem',
            borderRadius: '8px',
            fontSize: '0.82rem',
            marginBottom: '1.3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{erro}</span>
          </div>
        )}

        {/* Formulário de Login */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          {/* Campo E-mail */}
          <div>
            <label style={{ display: 'block', color: '#d1d5db', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.45rem' }}>
              E-mail
            </label>
            <div 
              className="campo-caixa"
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#14141e',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0 0.85rem'
              }}
            >
              <Mail size={17} color={campoFocado === 'email' ? '#41d686' : '#71717a'} style={{ flexShrink: 0, marginRight: '0.65rem', transition: 'color 0.2s' }} />
              <input
                type="email"
                required
                value={email}
                onFocus={() => setCampoFocado('email')}
                onBlur={() => setCampoFocado(null)}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@taskflow.com"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  padding: '0.82rem 0',
                  fontSize: '0.9rem'
                }}
              />

              {/* Botão para limpar */}
              {email && (
                <button
                  type="button"
                  onClick={() => setEmail('')}
                  title="Limpar campo"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#71717a',
                    cursor: 'pointer',
                    padding: '0.2rem',
                    marginRight: '0.35rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <X size={14} />
                </button>
              )}

              {/* Check animado de e-mail válido */}
              {emailValido && (
                <span 
                  title="E-mail com formato válido"
                  style={{ 
                    color: '#41d686', 
                    display: 'flex', 
                    alignItems: 'center',
                    animation: 'popIconeCheck 0.3s cubic-bezier(0.17, 0.89, 0.32, 1.28) forwards'
                  }}
                >
                  <Check size={16} />
                </span>
              )}
            </div>
          </div>

          {/* Campo Senha com Olho */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <label style={{ color: '#d1d5db', fontSize: '0.82rem', fontWeight: 600 }}>
                Senha
              </label>
              {capsLockAtivo && (
                <span style={{ color: '#f6c330', fontSize: '0.72rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  ⚠️ Caps Lock ativo
                </span>
              )}
            </div>

            <div 
              className="campo-caixa"
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#14141e',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0 0.85rem'
              }}
            >
              <Lock size={17} color={campoFocado === 'senha' ? '#818cf8' : '#71717a'} style={{ flexShrink: 0, marginRight: '0.65rem', transition: 'color 0.2s' }} />
              <input
                type={mostrarSenha ? 'text' : 'password'}
                required
                value={senha}
                onFocus={() => setCampoFocado('senha')}
                onBlur={() => setCampoFocado(null)}
                onChange={(e) => setSenha(e.target.value)}
                onKeyUp={verificarCapsLock}
                onKeyDown={verificarCapsLock}
                placeholder="Digite sua senha"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  padding: '0.82rem 0',
                  fontSize: '0.9rem'
                }}
              />

              {/* Olho Interativo com Rotação */}
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="btn-toggle-olho"
                title={mostrarSenha ? 'Ocultar senha' : 'Exibir senha'}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: mostrarSenha ? '#41d686' : '#71717a'
                }}
              >
                {mostrarSenha ? (
                  <EyeOff size={18} className="anim-olho-rotacionar" />
                ) : (
                  <Eye size={18} className="anim-olho-rotacionar" />
                )}
              </button>
            </div>
          </div>

          {/* Toggle Switch Interativo: Lembrar Sessão */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.1rem' }}>
            <span style={{ color: '#9ca3af', fontSize: '0.8rem', userSelect: 'none' }}>
              Lembrar credenciais no navegador
            </span>
            <div 
              onClick={() => setLembrarMe(!lembrarMe)}
              style={{
                width: '38px',
                height: '20px',
                borderRadius: '20px',
                backgroundColor: lembrarMe ? '#41d686' : '#272736',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 0.25s ease'
              }}
            >
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                position: 'absolute',
                top: '3px',
                left: lembrarMe ? '21px' : '3px',
                transition: 'left 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
              }} />
            </div>
          </div>

          {/* Botão Entrar com Shimmer */}
          <button
            type="submit"
            disabled={carregando || sucesso}
            className="btn-login-principal"
            style={{
              marginTop: '0.6rem',
              background: sucesso ? '#22c55e' : '#41d686',
              color: '#0c0c12',
              border: 'none',
              borderRadius: '8px',
              padding: '0.88rem',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: carregando || sucesso ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 18px rgba(65, 214, 134, 0.28)'
            }}
          >
            {carregando ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : sucesso ? (
              <>
                <CheckCircle2 size={18} />
                <span>Autorizado! Entrando...</span>
              </>
            ) : (
              <>
                <span>Entrar no Sistema</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {/* Rodapé Oficial */}
        <div style={{ 
          marginTop: '1.8rem', 
          borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
          paddingTop: '1.1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          textAlign: 'center'
        }}>
          <div style={{ color: '#d1d5db', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <UserCheck size={14} color="#41d686" />
            <span>Desenvolvido por <strong>Khauan Leonardo</strong></span>
          </div>

          <div style={{ color: '#71717a', fontSize: '0.74rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
            <GraduationCap size={14} color="#818cf8" />
            <span>Orientação: <strong>Prof. Alan Glei</strong> • SENAI CTGAS-ER</span>
          </div>
        </div>

      </div>
    </div>
  );
}
