// src/componentes/ModalPerfil.jsx
// Modal completo para gerenciamento de perfil, foto e dados do usuário

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  X, 
  Upload, 
  Trash2, 
  Check, 
  Camera, 
  User, 
  Mail, 
  Briefcase, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import Avatar from './Avatar';
import { salvarFotoUsuario, removerFotoUsuario, obterFotoUsuario } from '../utils/funcionarios';

export default function ModalPerfil({ aberto, aoFechar }) {
  const { usuario } = useAuth();
  const [previaFoto, setPreviaFoto] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erro, setErro] = useState('');

  if (!aberto) return null;

  const perfilAtual = obterFotoUsuario(usuario);

  function lidarComArquivo(e) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    if (!arquivo.type.startsWith('image/')) {
      setErro('Por favor, selecione um arquivo de imagem válido (PNG, JPG, WEBP).');
      return;
    }

    if (arquivo.size > 3 * 1024 * 1024) {
      setErro('A imagem selecionada deve ter no máximo 3MB.');
      return;
    }

    setErro('');
    const leitor = new FileReader();
    leitor.onload = (evento) => {
      setPreviaFoto(evento.target?.result);
    };
    leitor.readAsDataURL(arquivo);
  }

  function salvarAlteracoes(e) {
    e.preventDefault();
    try {
      if (previaFoto) {
        salvarFotoUsuario(usuario, previaFoto);
      }
      setMensagemSucesso('Perfil atualizado com sucesso!');
      setTimeout(() => {
        setMensagemSucesso('');
        aoFechar();
      }, 1200);
    } catch {
      setErro('Não foi possível salvar a imagem. Tente uma imagem menor.');
    }
  }

  function handleRemoverFoto() {
    removerFotoUsuario(usuario);
    setPreviaFoto(null);
    setMensagemSucesso('Foto removida. Utilizando avatar padrão.');
    setTimeout(() => setMensagemSucesso(''), 2000);
  }

  return (
    <div className="modal-overlay" onClick={aoFechar}>
      <div 
        className="modal-content modal-perfil-card" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-cabecalho">
          <div className="modal-titulo-bloco">
            <User size={22} className="modal-icone-destaque" />
            <div>
              <h3>Meu Perfil & Identidade</h3>
              <p>Personalize sua foto de exibição e visualize suas credenciais.</p>
            </div>
          </div>
          <button onClick={aoFechar} className="btn-fechar-modal" title="Fechar">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={salvarAlteracoes} className="modal-corpo-perfil">
          {/* Seção da Foto */}
          <div className="area-upload-avatar">
            <div className="avatar-preview-wrapper">
              <Avatar
                usuario={usuario}
                foto={previaFoto || perfilAtual.url}
                tamanho="xl"
                className="avatar-perfil-destaque"
              />
              <label htmlFor="input-foto-perfil" className="badge-alterar-foto" title="Escolher nova foto">
                <Camera size={16} />
              </label>
              <input
                id="input-foto-perfil"
                type="file"
                accept="image/*"
                onChange={lidarComArquivo}
                style={{ display: 'none' }}
              />
            </div>

            <div className="acoes-foto-info">
              <h4>{usuario?.nome || 'Usuário TaskFlow'}</h4>
              <p className="status-ativo-chip">
                <span className="ponto-verde"></span> Online no sistema
              </p>

              <div className="grupo-botoes-foto">
                <label htmlFor="input-foto-perfil" className="btn-upload-foto">
                  <Upload size={14} />
                  <span>{previaFoto || perfilAtual.url ? 'Alterar foto' : 'Enviar foto'}</span>
                </label>

                {(previaFoto || perfilAtual.url) && (
                  <button 
                    type="button" 
                    onClick={handleRemoverFoto} 
                    className="btn-remover-foto"
                    title="Remover foto e usar avatar padrão"
                  >
                    <Trash2 size={14} />
                    <span>Remover</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Dados Pessoais / Credenciais */}
          <div className="campos-perfil-grid">
            <div className="campo-info-card">
              <span className="rotulo-info"><User size={14} /> Nome Completo</span>
              <span className="valor-info">{usuario?.nome || 'Admin'}</span>
            </div>

            <div className="campo-info-card">
              <span className="rotulo-info"><Mail size={14} /> E-mail Cadastrado</span>
              <span className="valor-info">{usuario?.email || 'admin@taskflow.com'}</span>
            </div>

            <div className="campo-info-card">
              <span className="rotulo-info"><Briefcase size={14} /> Função na Equipe</span>
              <span className="valor-info">Engenharia de Software • Full Stack</span>
            </div>

            <div className="campo-info-card">
              <span className="rotulo-info"><ShieldCheck size={14} /> Nível de Acesso</span>
              <span className="valor-info badge-acesso-admin">Administrador / Autor</span>
            </div>
          </div>

          {erro && <div className="alerta-erro-modal">{erro}</div>}
          {mensagemSucesso && (
            <div className="alerta-sucesso-modal">
              <Check size={16} /> {mensagemSucesso}
            </div>
          )}

          <div className="modal-acoes-perfil">
            <button type="button" onClick={aoFechar} className="btn-cancelar">
              Fechar
            </button>
            <button type="submit" className="btn-salvar">
              <Sparkles size={16} />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
