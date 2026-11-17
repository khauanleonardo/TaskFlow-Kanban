// src/App.jsx
// Estrutura principal do TaskFlow, com tema, navegação lateral e rotas.

import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from './componentes/Sidebar';
import RotaPrivada from './componentes/RotaPrivada';
import Login from './pages/Login';
import Kanban from './pages/kanban';
import Sobre from './pages/Sobre';
import './styles.css';

export default function App() {
  const { token } = useAuth();
  const [sidebarAberta, setSidebarAberta] = useState(true);

  return (
    <ThemeProvider>
      <div className="app-container-moderno">
        {token && (
          <Sidebar
            aberta={sidebarAberta}
            setAberta={setSidebarAberta}
          />
        )}

        <main
          className={token ? 'main-content-moderno' : 'main-content-login'}
          style={{
            marginLeft: token ? (sidebarAberta ? '260px' : '72px') : '0',
            transition: 'margin-left 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
            minWidth: 0,
            width: '100%'
          }}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={<RotaPrivada><Navigate to="/kanban" replace /></RotaPrivada>}
            />
            <Route
              path="/kanban"
              element={<RotaPrivada><Kanban /></RotaPrivada>}
            />
            <Route
              path="/sobre"
              element={<RotaPrivada><Sobre /></RotaPrivada>}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}
