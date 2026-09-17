import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout(); // Limpa o estado e o localStorage
    navigate('/login'); // Redireciona para a página de login
  }

  return (
    <aside
      style={{
        width: '220px',
        height: '100vh',
        backgroundColor: '#202024',
        borderRight: '1px solid #323238',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px',
        boxSizing: 'border-box',
        position: 'fixed',
        left: 0,
        top: 0,
      }}
    >
      <div>
        {/* Título/Logo do projeto */}
        <h2 style={{ color: '#00b37e', margin: '0 0 30px 0', fontSize: '20px' }}>
          TaskFlow
        </h2>

        {/* Links de Navegação */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#e1e1e6',
              textDecoration: 'none',
              padding: '10px',
              borderRadius: '6px',
              backgroundColor: '#121214',
            }}
          >
            <LayoutDashboard size={18} color="#00b37e" />
            <span>Kanban</span>
          </Link>
        </nav>
      </div>

      {/* Área do Usuário Logado e Botão de Sair */}
      <div
        style={{
          borderTop: '1px solid #323238',
          paddingTop: '15px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <User size={18} color="#8d8d99" />
          <span style={{ color: '#c4c4cc', fontSize: '14px', fontWeight: 'bold' }}>
            Olá, {usuario?.nome ?? 'Usuário'}
          </span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '10px',
            backgroundColor: 'transparent',
            border: '1px solid #f87171',
            color: '#f87171',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
          }}
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  );
}