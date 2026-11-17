// src/contexts/ThemeContext.jsx
// Gerenciamento de tema, cor de destaque e preferências individuais por usuário

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export const CORES_DESTAQUE = [
  { id: 'roxo', nome: 'Roxo Neônio', hex: '#8b5cf6', hover: '#7c3aed', glow: 'rgba(139, 92, 246, 0.35)' },
  { id: 'azul', nome: 'Azul Elétrico', hex: '#3b82f6', hover: '#2563eb', glow: 'rgba(59, 130, 246, 0.35)' },
  { id: 'verde', nome: 'Esmeralda', hex: '#10b981', hover: '#059669', glow: 'rgba(16, 185, 129, 0.35)' },
  { id: 'laranja', nome: 'Laranja Sunset', hex: '#f59e0b', hover: '#d97706', glow: 'rgba(245, 158, 11, 0.35)' },
  { id: 'rosa', nome: 'Rosa Cyber', hex: '#ec4899', hover: '#db2777', glow: 'rgba(236, 72, 153, 0.35)' },
  { id: 'ciano', nome: 'Ciano Espacial', hex: '#06b6d4', hover: '#0891b2', glow: 'rgba(6, 182, 212, 0.35)' }
];

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const { usuario } = useAuth();
  const idChave = usuario?.id || usuario?.email || 'padrao';

  const [tema, setTema] = useState('dark');
  const [corId, setCorId] = useState('roxo');
  const [densidade, setDensidade] = useState('confortavel');

  // Carrega preferências específicas do usuário logado
  useEffect(() => {
    try {
      const salvas = localStorage.getItem(`taskflow_prefs_${idChave}`);
      if (salvas) {
        const parsed = JSON.parse(salvas);
        if (parsed.tema) setTema(parsed.tema);
        if (parsed.corId) setCorId(parsed.corId);
        if (parsed.densidade) setDensidade(parsed.densidade);
      } else {
        setTema('dark');
        setCorId('roxo');
        setDensidade('confortavel');
      }
    } catch {
      // Fallback padrão
    }
  }, [idChave]);

  // Aplica tema e variáveis CSS globais no HTML/body
  useEffect(() => {
    const configCor = CORES_DESTAQUE.find(c => c.id === corId) || CORES_DESTAQUE[0];
    const root = document.documentElement;

    root.setAttribute('data-theme', tema);
    root.setAttribute('data-densidade', densidade);

    root.style.setProperty('--cor-primaria', configCor.hex);
    root.style.setProperty('--cor-primaria-hover', configCor.hover);
    root.style.setProperty('--cor-primaria-glow', configCor.glow);
  }, [tema, corId, densidade]);

  // Função para salvar preferências do usuário atual
  function atualizarPreferencias(novasPrefs) {
    const novoTema = novasPrefs.tema !== undefined ? novasPrefs.tema : tema;
    const novoCorId = novasPrefs.corId !== undefined ? novasPrefs.corId : corId;
    const novoDensidade = novasPrefs.densidade !== undefined ? novasPrefs.densidade : densidade;

    setTema(novoTema);
    setCorId(novoCorId);
    setDensidade(novoDensidade);

    try {
      localStorage.setItem(`taskflow_prefs_${idChave}`, JSON.stringify({
        tema: novoTema,
        corId: novoCorId,
        densidade: novoDensidade,
        atualizadoEm: new Date().toISOString()
      }));
    } catch {
      // Ignora erro de cota
    }
  }

  function alternarTema() {
    atualizarPreferencias({ tema: tema === 'dark' ? 'light' : 'dark' });
  }

  const corAtual = CORES_DESTAQUE.find(c => c.id === corId) || CORES_DESTAQUE[0];

  return (
    <ThemeContext.Provider value={{
      tema,
      corId,
      corAtual,
      densidade,
      alternarTema,
      atualizarPreferencias,
      coresDisponiveis: CORES_DESTAQUE
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
}
