import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './componentes/Sidebar';
import RotaPrivada from './componentes/RotaPrivada';
import Login from './pages/Login';
import Kanban from './pages/kanban';
import Sobre from './pages/Sobre';

export default function App() {
  const { token } = useAuth();
  const [sidebarAberta, setSidebarAberta] = useState(true);

  return (
    <div className="app-container">
      {token && <Sidebar aberta={sidebarAberta} setAberta={setSidebarAberta} />}
      <main 
        className="main-content" 
        style={{ 
          marginLeft: token ? (sidebarAberta ? '260px' : '76px') : '0',
          transition: 'margin-left 0.28s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RotaPrivada><Kanban /></RotaPrivada>} />
          <Route path="/sobre" element={<RotaPrivada><Sobre /></RotaPrivada>} />
        </Routes>
      </main>
    </div>
  );
}
