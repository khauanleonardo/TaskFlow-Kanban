// src/App.jsx
// Ponto de entrada com gerenciamento de rotas, topbar, sidebar e layout centralizado

import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from './componentes/Sidebar';
import Topbar from './componentes/Topbar';
import RotaPrivada from './componentes/RotaPrivada';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Kanban from './pages/kanban';
import Sobre from './pages/Sobre';
import './styles.css';

export default function App() {
  const { token } = useAuth();
  const [sidebarAberta, setSidebarAberta] = useState(true);
  const [buscaGlobal, setBuscaGlobal] = useState('');

  return (
    <ThemeProvider>
      <div className="app-container">
        {token && <Sidebar aberta={sidebarAberta} setAberta={setSidebarAberta} />}
        <div 
          className={token ? "layout-conteudo-wrapper" : "layout-login-wrapper"}
          style={{
            marginLeft: token ? (sidebarAberta ? '260px' : '72px') : '0',
            transition: 'margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            minWidth: 0,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
          }}
        >
          {token && (
            <Topbar 
              buscaGlobal={buscaGlobal} 
              setBuscaGlobal={setBuscaGlobal} 
            />
          )}
          <main className="conteudo-principal-pagina">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<RotaPrivada><Dashboard /></RotaPrivada>} />
              <Route path="/dashboard" element={<RotaPrivada><Dashboard /></RotaPrivada>} />
              <Route path="/kanban" element={<RotaPrivada><Kanban /></RotaPrivada>} />
              <Route path="/sobre" element={<RotaPrivada><Sobre /></RotaPrivada>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
