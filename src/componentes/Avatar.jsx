// src/componentes/Avatar.jsx
// Componente de avatar individualizado com suporte a foto real, upload e fallback elegante

import React, { useEffect, useState } from 'react';
import { extrairIniciais, gerarCorPorNome, obterFotoUsuario } from '../utils/funcionarios';

export default function Avatar({ 
  usuario, 
  nome, 
  foto, 
  tamanho = 'md', 
  className = '', 
  online = false, 
  title 
}) {
  const dadosUsuario = usuario || { nome: nome || 'Usuário' };

  const [perfil, setPerfil] = useState(() => {
    const obtido = obterFotoUsuario(dadosUsuario);
    return {
      nome: nome || obtido.nome,
      url: foto || obtido.url,
      iniciais: extrairIniciais(nome || obtido.nome),
      cor: gerarCorPorNome(nome || obtido.nome)
    };
  });

  useEffect(() => {
    const atualizar = () => {
      const obtido = obterFotoUsuario(dadosUsuario);
      setPerfil({
        nome: nome || obtido.nome,
        url: foto || obtido.url,
        iniciais: extrairIniciais(nome || obtido.nome),
        cor: gerarCorPorNome(nome || obtido.nome)
      });
    };

    atualizar();
    window.addEventListener('taskflow-avatar-atualizado', atualizar);
    return () => window.removeEventListener('taskflow-avatar-atualizado', atualizar);
  }, [usuario, nome, foto]);

  return (
    <span
      className={`tf-avatar tf-avatar-${tamanho} ${className}`.trim()}
      style={{ '--avatar-bg': perfil.cor }}
      title={title || perfil.nome}
      aria-label={`Avatar de ${perfil.nome}`}
    >
      {perfil.url ? (
        <img
          src={perfil.url}
          alt={`Foto de ${perfil.nome}`}
          onError={() => setPerfil((p) => ({ ...p, url: null }))}
        />
      ) : (
        <span className="tf-avatar-iniciais">{perfil.iniciais}</span>
      )}
      {online && <i className="tf-avatar-online" aria-label="Online" />}
    </span>
  );
}
