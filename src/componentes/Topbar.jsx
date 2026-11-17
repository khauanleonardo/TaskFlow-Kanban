// src/componentes/Topbar.jsx
// Barra superior com busca global, notificações, tema, avatar e menu de perfil

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Palette, 
  User, 
  LogOut, 
  ChevronDown, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Command
} from 'lucide-react';
import Avatar from './Avatar';
import ModalPerfil from './ModalPerfil';
import ModalPersonalizacao from './ModalPersonalizacao';

export default function Topbar({ buscaGlobal, setBuscaGlobal, onNovaTarefa }) {
  const { usuario, logout } = useAuth();
  const { tema, alternarTema } = useTheme();
  const navigate = useNavigate();

  const [menuPerfilAberto, setMenuPerfilAberto] = useState(false);
  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);
  const [modalPerfilAberto, setModalPerfilAberto] = useState(false);
  const [modalPersonalizacaoAberto, setModalPersonalizacaoAberto] = useState(false);

  const refPerfil = useRef(null);
  const refNotif = useRef(null);

  // Fecha menus ao clicar fora
  useEffect(() => {
    function lidarComCliqueFora(e) {
      if (refPerfil.current && !refPerfil.current.contains(e.target)) {
        setMenuPerfilAberto(false);
      }
      if (refNotif.current && !refNotif.current.contains(e.target)) {
        setNotificacoesAbertas(false);
      }
    }
    document.addEventListener('mousedown', lidarComCliqueFora);
    return () => document.removeEventListener('mousedown', lidarComCliqueFora);
  }, []);

  const notificacoesMock = [
    {
      id: 1,
      titulo: 'Nova tarefa atribuída',
      desc: 'Ana Lima atribuiu "Revisar testes da API" para você.',
      tempo: 'Há 10 min',
      icone: Clock,
      lida: false
    },
    {
      id: 2,
      titulo: 'Tarefa Concluída',
      desc: 'Carlos Eduardo finalizou "Configurar Jest e Coverage".',
      tempo: 'Há 45 min',
      icone: CheckCircle2,
      lida: false
    },
    {
      id: 3,
      titulo: 'Meta da Sprint',
      desc: 'A equipe atingiu 82% das entregas programadas.',
      tempo: 'Hoje às 09:30',
      icone: Sparkles,
      lida: true
    }
  ];

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <>
      <header className="topbar-container">
        {/* Campo de Busca Global */}
        <div className="topbar-busca">
          <Search size={18} className="icone-busca" />
          <input
            type="text"
            placeholder="Buscar tarefas, projetos, membros..."
            value={buscaGlobal || ''}
            onChange={(e) => setBuscaGlobal && setBuscaGlobal(e.target.value)}
            className="input-busca-global"
          />
          <span className="atalho-busca" title="Atalho rápido">
            <Command size={11} /> K
          </span>
        </div>

        {/* Ações da Direita */}
        <div className="topbar-acoes">
          {/* Alternar Tema Rápido */}
          <button
            type="button"
            className="btn-icone-topbar"
            onClick={alternarTema}
            title={`Alternar para tema ${tema === 'dark' ? 'claro' : 'escuro'}`}
          >
            {tema === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Botão de Personalização */}
          <button
            type="button"
            className="btn-icone-topbar"
            onClick={() => setModalPersonalizacaoAberto(true)}
            title="Personalizar cores e tema"
          >
            <Palette size={19} />
          </button>

          {/* Notificações */}
          <div className="dropdown-wrapper" ref={refNotif}>
            <button
              type="button"
              className="btn-icone-topbar notif-btn"
              onClick={() => setNotificacoesAbertas(!notificacoesAbertas)}
              title="Notificações"
            >
              <Bell size={19} />
              <span className="ponto-notificacao">2</span>
            </button>

            {notificacoesAbertas && (
              <div className="dropdown-menu dropdown-notificacoes">
                <div className="dropdown-header-notif">
                  <span className="titulo-notif">Notificações</span>
                  <span className="badge-novas">2 novas</span>
                </div>
                <div className="lista-notificacoes">
                  {notificacoesMock.map((n) => {
                    const IconeN = n.icone;
                    return (
                      <div key={n.id} className={`item-notif ${!n.lida ? 'nao-lida' : ''}`}>
                        <div className="icone-notif-box">
                          <IconeN size={15} />
                        </div>
                        <div className="conteudo-notif">
                          <strong>{n.titulo}</strong>
                          <p>{n.desc}</p>
                          <span className="tempo-notif">{n.tempo}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Perfil do Usuário com Foto e Dropdown */}
          <div className="dropdown-wrapper" ref={refPerfil}>
            <button
              type="button"
              className="btn-perfil-topbar"
              onClick={() => setMenuPerfilAberto(!menuPerfilAberto)}
              title="Menu do usuário"
            >
              <Avatar
                usuario={usuario}
                tamanho="sm"
                online={true}
                className="avatar-topo"
              />
              <div className="info-usuario-topbar">
                <span className="nome-topbar">{usuario?.nome || 'Admin'}</span>
                <span className="cargo-topbar">Full Stack</span>
              </div>
              <ChevronDown size={15} className={`seta-dropdown ${menuPerfilAberto ? 'girada' : ''}`} />
            </button>

            {menuPerfilAberto && (
              <div className="dropdown-menu dropdown-perfil">
                <div className="cabecalho-dropdown-perfil">
                  <Avatar usuario={usuario} tamanho="md" online={true} />
                  <div className="dados-perfil-dropdown">
                    <strong>{usuario?.nome || 'Admin'}</strong>
                    <span>{usuario?.email || 'admin@taskflow.com'}</span>
                  </div>
                </div>

                <div className="divisor-dropdown"></div>

                <button
                  type="button"
                  className="item-menu-dropdown"
                  onClick={() => {
                    setMenuPerfilAberto(false);
                    setModalPerfilAberto(true);
                  }}
                >
                  <User size={16} />
                  <span>Meu Perfil & Foto</span>
                </button>

                <button
                  type="button"
                  className="item-menu-dropdown"
                  onClick={() => {
                    setMenuPerfilAberto(false);
                    setModalPersonalizacaoAberto(true);
                  }}
                >
                  <Palette size={16} />
                  <span>Personalização</span>
                </button>

                <div className="divisor-dropdown"></div>

                <button
                  type="button"
                  className="item-menu-dropdown item-logout"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Sair da Conta</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modais de Perfil e Personalização */}
      <ModalPerfil
        aberto={modalPerfilAberto}
        aoFechar={() => setModalPerfilAberto(false)}
      />
      <ModalPersonalizacao
        aberto={modalPersonalizacaoAberto}
        aoFechar={() => setModalPersonalizacaoAberto(false)}
      />
    </>
  );
}
