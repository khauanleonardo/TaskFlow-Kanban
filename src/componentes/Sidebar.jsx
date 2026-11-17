// src/componentes/Sidebar.jsx
// Barra lateral de navegação retrátil, moderna e responsiva

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Kanban, 
  Sparkles, 
  LogOut, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Workflow,
  FolderKanban,
  CheckCircle2
} from 'lucide-react';
import Avatar from './Avatar';

export default function Sidebar({ aberta, setAberta }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside className={`sidebar ${aberta ? 'sidebar-aberta' : 'sidebar-fechada'}`}>
      <div className="sidebar-topo">
        {aberta ? (
          <div className="sidebar-cabecalho-aberto">
            <div 
              className="marca-logo" 
              onClick={() => navigate('/')} 
              style={{ cursor: 'pointer' }}
              title="TaskFlow - Início"
            >
              <span className="icone-workflow-wrapper">
                <Workflow size={20} className="icone-workflow-svg" />
              </span>
              <div className="marca-texto">
                <span className="titulo-taskflow">TaskFlow</span>
                <span className="subtitulo-taskflow">WORKSPACE ÁGIL</span>
              </div>
            </div>
            <button
              onClick={() => setAberta(false)}
              className="btn-toggle-sidebar"
              title="Recolher menu lateral"
              type="button"
            >
              <PanelLeftClose size={18} />
            </button>
          </div>
        ) : (
          <div className="sidebar-cabecalho-fechado">
            <button
              onClick={() => setAberta(true)}
              className="btn-toggle-sidebar centralizado"
              title="Expandir menu lateral"
              type="button"
            >
              <PanelLeftOpen size={20} />
            </button>
          </div>
        )}

        {/* Links de Navegação */}
        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `link-item ${isActive ? 'ativo' : ''} ${!aberta ? 'link-centralizado' : ''}`}
            title="Visão Geral & Dashboard"
          >
            <LayoutDashboard size={20} className="icone-nav" />
            {aberta && <span className="rotulo-nav">Visão Geral</span>}
            {aberta && <span className="badge-nav-kpi">Métricas</span>}
          </NavLink>

          <NavLink
            to="/kanban"
            className={({ isActive }) => `link-item ${isActive ? 'ativo' : ''} ${!aberta ? 'link-centralizado' : ''}`}
            title="Quadro Kanban de Tarefas"
          >
            <Kanban size={20} className="icone-nav" />
            {aberta && <span className="rotulo-nav">Quadro Kanban</span>}
            {aberta && <span className="badge-nav-tag">Ágil</span>}
          </NavLink>

          <NavLink
            to="/sobre"
            className={({ isActive }) => `link-item ${isActive ? 'ativo' : ''} ${!aberta ? 'link-centralizado' : ''}`}
            title="Sobre o TaskFlow & Arquitetura"
          >
            <Sparkles size={20} className="icone-nav" />
            {aberta && <span className="rotulo-nav">Sobre & Arquitetura</span>}
          </NavLink>
        </nav>
      </div>

      {/* Rodapé da Sidebar */}
      <div className="sidebar-rodape">
        {aberta ? (
          <div className="usuario-bloco-rodape">
            <Avatar usuario={usuario} tamanho="sm" online={true} />
            <div className="dados-usuario-rodape">
              <span className="nome-rodape">{usuario?.nome || 'Admin'}</span>
              <span className="email-rodape">{usuario?.email || 'admin@taskflow.com'}</span>
            </div>
            <button 
              onClick={handleLogout} 
              className="btn-logout-rodape" 
              type="button" 
              title="Sair da conta"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button 
            onClick={handleLogout} 
            className="btn-sair-icone" 
            type="button" 
            title="Sair da conta"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </aside>
  );
}
