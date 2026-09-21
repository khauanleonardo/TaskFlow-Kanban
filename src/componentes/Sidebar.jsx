import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Info, LogOut, PanelLeftClose, PanelLeftOpen, Workflow } from 'lucide-react';

export default function Sidebar({ aberta, setAberta }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside className={`sidebar ${aberta ? 'sidebar-aberta' : 'sidebar-fechada'}`}>
      <div className="sidebar-topo">
        {aberta ? (
          <div className="sidebar-cabecalho-aberto">
            <div className="marca-logo">
              <span className="icone-workflow">
                <Workflow size={20} />
              </span>
              <span className="titulo-taskflow">TaskFlow</span>
            </div>
            <button
              onClick={() => setAberta(false)}
              className="btn-toggle"
              title="Recolher menu"
            >
              <PanelLeftClose size={18} />
            </button>
          </div>
        ) : (
          <div className="sidebar-cabecalho-fechado">
            <button
              onClick={() => setAberta(true)}
              className="btn-toggle centralizado"
              title="Expandir menu"
            >
              <PanelLeftOpen size={20} />
            </button>
          </div>
        )}

        <nav className="nav-links">
          <Link
            to="/"
            className={`link-item ${location.pathname === '/' ? 'ativo' : ''} ${!aberta ? 'link-centralizado' : ''}`}
            title="Dashboard"
          >
            <LayoutDashboard size={20} className="icone-nav" />
            {aberta && <span>Dashboard</span>}
          </Link>

          <Link
            to="/sobre"
            className={`link-item ${location.pathname === '/sobre' ? 'ativo' : ''} ${!aberta ? 'link-centralizado' : ''}`}
            title="Sobre o TaskFlow"
          >
            <Info size={20} className="icone-nav" />
            {aberta && <span>Sobre</span>}
          </Link>
        </nav>
      </div>

      <div className="sidebar-rodape">
        {aberta ? (
          <>
            <div className="dados-usuario">
              <span className="nome-usuario">Olá, {usuario?.nome ?? 'Admin'}</span>
              <span className="email-usuario">{usuario?.email ?? 'admin@taskflow.com'}</span>
            </div>
            <button onClick={handleLogout} className="btn-sair-aberto">
              <LogOut size={16} />
              <span>Sair</span>
            </button>
          </>
        ) : (
          <button onClick={handleLogout} className="btn-sair-icone" title="Sair da conta">
            <LogOut size={18} />
          </button>
        )}
      </div>
    </aside>
  );
}
