// src/utils/funcionarios.js
// Gerenciamento de equipe, avatares individuais e upload de foto de perfil

export const MEMBROS_EQUIPE_PADRAO = [
  {
    id: 1,
    nome: 'Lucas Almeida',
    email: 'lucas.almeida@taskflow.com',
    cargo: 'Product Designer',
    departamento: 'Design & UX',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    online: true,
    corFallback: '#8b5cf6'
  },
  {
    id: 2,
    nome: 'Ana Lima',
    email: 'ana.lima@taskflow.com',
    cargo: 'Frontend Specialist',
    departamento: 'Engenharia de Software',
    foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    online: true,
    corFallback: '#ec4899'
  },
  {
    id: 3,
    nome: 'Carlos Eduardo',
    email: 'carlos.eduardo@taskflow.com',
    cargo: 'Tech Lead / Backend',
    departamento: 'Engenharia de Software',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    online: false,
    corFallback: '#3b82f6'
  },
  {
    id: 4,
    nome: 'Mariana Costa',
    email: 'mariana.costa@taskflow.com',
    cargo: 'QA Engineer',
    departamento: 'Qualidade & Testes',
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    online: true,
    corFallback: '#10b981'
  },
  {
    id: 5,
    nome: 'Beatriz Santos',
    email: 'beatriz.santos@taskflow.com',
    cargo: 'DevOps & Cloud Specialist',
    departamento: 'Infraestrutura',
    foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    online: true,
    corFallback: '#f59e0b'
  },
  {
    id: 6,
    nome: 'Khauan Leonardo',
    email: 'khaueseveriano10@gmail.com',
    cargo: 'Full Stack Developer & Líder',
    departamento: 'Engenharia de Software',
    foto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    online: true,
    corFallback: '#06b6d4'
  },
  {
    id: 7,
    nome: 'Admin TaskFlow',
    email: 'admin@email.com',
    cargo: 'Administrador do Sistema',
    departamento: 'Gestão Geral',
    foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    online: true,
    corFallback: '#8b5cf6'
  }
];

// Gera cor determinística vibrante com base no nome
export function gerarCorPorNome(nome = 'Usuario') {
  const cores = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#6366f1'];
  let hash = 0;
  for (let i = 0; i < nome.length; i++) {
    hash = nome.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % cores.length;
  return cores[index];
}

// Extrai as duas primeiras iniciais de um nome
export function extrairIniciais(nome = 'Usuario') {
  if (!nome || typeof nome !== 'string') return 'TF';
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return 'TF';
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function chaveFotoUsuario(usuario) {
  const identificador = usuario?.id || usuario?.email || 'atual';
  return `taskflow_avatar_${identificador}`;
}

// Retorna dados de avatar para qualquer usuário (foto, iniciais, cor)
export function obterFotoUsuario(usuario) {
  if (!usuario) {
    return {
      url: null,
      iniciais: 'TF',
      cor: '#8b5cf6',
      nome: 'Usuário'
    };
  }

  const nome = usuario.nome || usuario.email || 'Usuário';
  const chave = chaveFotoUsuario(usuario);
  const fotoSalva = typeof window !== 'undefined' ? localStorage.getItem(chave) : null;

  if (fotoSalva) {
    return {
      url: fotoSalva,
      iniciais: extrairIniciais(nome),
      cor: gerarCorPorNome(nome),
      nome
    };
  }

  const emailLimpo = (usuario.email || '').toLowerCase().trim();
  const nomeLimpo = nome.toLowerCase().trim();

  const membro = MEMBROS_EQUIPE_PADRAO.find(m => 
    (m.email && m.email.toLowerCase() === emailLimpo) ||
    m.nome.toLowerCase() === nomeLimpo ||
    m.nome.toLowerCase().includes(nomeLimpo) ||
    (usuario.id && Number(m.id) === Number(usuario.id))
  );

  if (membro && membro.foto) {
    return {
      url: membro.foto,
      iniciais: extrairIniciais(membro.nome),
      cor: membro.corFallback,
      nome: membro.nome
    };
  }

  return {
    url: null,
    iniciais: extrairIniciais(nome),
    cor: gerarCorPorNome(nome),
    nome
  };
}

// Salva foto enviada pelo usuário (Base64) vinculada ao perfil no localStorage
export function salvarFotoUsuario(usuario, fotoBase64) {
  if (!usuario || typeof window === 'undefined') return;
  const chave = chaveFotoUsuario(usuario);
  localStorage.setItem(chave, fotoBase64);
  window.dispatchEvent(new CustomEvent('taskflow-avatar-atualizado', {
    detail: { usuario, foto: fotoBase64 }
  }));
}

// Remove foto personalizada e volta ao avatar padrão
export function removerFotoUsuario(usuario) {
  if (!usuario || typeof window === 'undefined') return;
  const chave = chaveFotoUsuario(usuario);
  localStorage.removeItem(chave);
  window.dispatchEvent(new CustomEvent('taskflow-avatar-atualizado', {
    detail: { usuario, foto: null }
  }));
}
