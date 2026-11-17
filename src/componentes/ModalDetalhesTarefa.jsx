// src/componentes/ModalDetalhesTarefa.jsx
// Modal de detalhes ricos da tarefa: checklist de subtarefas, comentários, membros e prioridade

import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckSquare, 
  MessageSquare, 
  Clock, 
  FolderKanban, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Send, 
  Calendar,
  CheckCircle2,
  Sparkles,
  Layers
} from 'lucide-react';
import Avatar from './Avatar';
import { useAuth } from '../contexts/AuthContext';
import { MEMBROS_EQUIPE_PADRAO } from '../utils/funcionarios';

export default function ModalDetalhesTarefa({ 
  tarefa, 
  aberto, 
  aoFechar, 
  aoAtualizar, 
  listaPrioridades = [], 
  listaUsuarios = [], 
  listaProjetos = [] 
}) {
  const { usuario: usuarioLogado } = useAuth();

  if (!aberto || !tarefa) return null;

  const idTarefa = tarefa.id;
  const chaveSubtarefas = `taskflow_subtarefas_${idTarefa}`;
  const chaveComentarios = `taskflow_comentarios_${idTarefa}`;

  // Subtarefas persistidas no localStorage
  const [subtarefas, setSubtarefas] = useState(() => {
    try {
      const salvas = localStorage.getItem(chaveSubtarefas);
      if (salvas) return JSON.parse(salvas);
    } catch {}
    return [
      { id: 1, texto: 'Analisar requisitos e dependências', concluida: true },
      { id: 2, texto: 'Implementar lógica e estilização visual', concluida: tarefa.coluna === 'concluido' },
      { id: 3, texto: 'Executar testes unitários e validações', concluida: tarefa.coluna === 'concluido' }
    ];
  });

  const [novoItemTexto, setNovoItemTexto] = useState('');

  // Comentários persistidos no localStorage
  const [comentarios, setComentarios] = useState(() => {
    try {
      const salvos = localStorage.getItem(chaveComentarios);
      if (salvos) return JSON.parse(salvos);
    } catch {}
    return [
      {
        id: 1,
        autor: 'Ana Lima',
        email: 'ana.lima@taskflow.com',
        texto: 'Estrutura inicial alinhada com os padrões de acessibilidade e design ágil.',
        tempo: 'Ontem às 16:45'
      }
    ];
  });

  const [novoComentario, setNovoComentario] = useState('');

  // Salva subtarefas
  useEffect(() => {
    try {
      localStorage.setItem(chaveSubtarefas, JSON.stringify(subtarefas));
    } catch {}
  }, [subtarefas, chaveSubtarefas]);

  // Salva comentários
  useEffect(() => {
    try {
      localStorage.setItem(chaveComentarios, JSON.stringify(comentarios));
    } catch {}
  }, [comentarios, chaveComentarios]);

  // Cálculo do progresso do checklist
  const totalSub = subtarefas.length;
  const concluidasSub = subtarefas.filter(s => s.concluida).length;
  const porcentagemProgresso = totalSub > 0 ? Math.round((concluidasSub / totalSub) * 100) : 0;

  function toggleSubtarefa(id) {
    setSubtarefas(subtarefas.map(s => s.id === id ? { ...s, concluida: !s.concluida } : s));
  }

  function adicionarSubtarefa(e) {
    e.preventDefault();
    if (!novoItemTexto.trim()) return;
    const novo = {
      id: Date.now(),
      texto: novoItemTexto.trim(),
      concluida: false
    };
    setSubtarefas([...subtarefas, novo]);
    setNovoItemTexto('');
  }

  function removerSubtarefa(id) {
    setSubtarefas(subtarefas.filter(s => s.id !== id));
  }

  function adicionarComentario(e) {
    e.preventDefault();
    if (!novoComentario.trim()) return;
    const novo = {
      id: Date.now(),
      autor: usuarioLogado?.nome || 'Admin',
      email: usuarioLogado?.email || 'admin@taskflow.com',
      texto: novoComentario.trim(),
      tempo: 'Agora mesmo'
    };
    setComentarios([...comentarios, novo]);
    setNovoComentario('');
  }

  // Encontra o usuário responsável
  const usuarioResp = listaUsuarios.find(u => u.id === tarefa.usuario_id) || {
    nome: tarefa.usuario_nome || 'Responsável',
    id: tarefa.usuario_id
  };

  const prioridadeNome = tarefa.refPrioridade?.nome || tarefa.prioridade || 'Média';
  const colunaNome = tarefa.coluna === 'afazer' ? 'A Fazer' : tarefa.coluna === 'andamento' ? 'Em Andamento' : 'Concluído';

  return (
    <div className="modal-overlay" onClick={aoFechar}>
      <div 
        className="modal-content modal-detalhes-tarefa-card" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Cabeçalho */}
        <div className="modal-cabecalho-detalhes">
          <div className="topo-detalhes-badges">
            <span className={`badge-coluna-detalhe coluna-${tarefa.coluna}`}>
              <Layers size={13} /> {colunaNome}
            </span>
            <span className={`badge-prioridade-detalhe prioridade-${(tarefa.prioridade || 'media').toLowerCase()}`}>
              <AlertCircle size={13} /> {prioridadeNome}
            </span>
          </div>
          <button onClick={aoFechar} className="btn-fechar-modal" title="Fechar">
            <X size={20} />
          </button>
        </div>

        {/* Título da Tarefa */}
        <div className="area-titulo-detalhe">
          <h2>{tarefa.texto || tarefa.titulo || 'Sem título'}</h2>
          <p className="descricao-detalhe">
            {tarefa.descricao || 'Nenhuma descrição detalhada informada para esta tarefa. Use o checklist e os comentários abaixo para coordenar a entrega.'}
          </p>
        </div>

        {/* Metadados: Responsável, Projeto e Data */}
        <div className="painel-meta-tarefa">
          <div className="item-meta">
            <span className="rotulo-meta">Responsável</span>
            <div className="valor-meta-usuario">
              <Avatar usuario={usuarioResp} tamanho="sm" online={true} />
              <div className="textos-meta-usuario">
                <strong>{usuarioResp.nome}</strong>
                <span>Membro Ativo</span>
              </div>
            </div>
          </div>

          <div className="item-meta">
            <span className="rotulo-meta">Projeto Vinculado</span>
            <div className="valor-meta-projeto">
              <FolderKanban size={15} className="icone-meta" />
              <span>{tarefa.projeto_nome || tarefa.projeto?.nome || 'TaskFlow Core'}</span>
            </div>
          </div>

          <div className="item-meta">
            <span className="rotulo-meta">Criada em</span>
            <div className="valor-meta-data">
              <Calendar size={15} className="icone-meta" />
              <span>{tarefa.criado_em ? new Date(tarefa.criado_em).toLocaleDateString('pt-BR') : 'Hoje'}</span>
            </div>
          </div>
        </div>

        {/* Seção Checklist / Subtarefas */}
        <div className="secao-checklist-tarefa">
          <div className="cabecalho-checklist">
            <div className="titulo-checklist-bloco">
              <CheckSquare size={17} className="icone-checklist" />
              <h4>Checklist de Entrega</h4>
            </div>
            <span className="contador-checklist">
              {concluidasSub} de {totalSub} ({porcentagemProgresso}%)
            </span>
          </div>

          {/* Barra de Progresso */}
          <div className="barra-progresso-trilho">
            <div 
              className="barra-progresso-preenchimento" 
              style={{ width: `${porcentagemProgresso}%` }}
            />
          </div>

          {/* Lista de Itens */}
          <ul className="lista-subtarefas">
            {subtarefas.map((sub) => (
              <li key={sub.id} className={`item-subtarefa ${sub.concluida ? 'concluida' : ''}`}>
                <label className="checkbox-subtarefa-custom">
                  <input
                    type="checkbox"
                    checked={sub.concluida}
                    onChange={() => toggleSubtarefa(sub.id)}
                  />
                  <span className="marcador-check"></span>
                  <span className="texto-item-subtarefa">{sub.texto}</span>
                </label>
                <button
                  type="button"
                  onClick={() => removerSubtarefa(sub.id)}
                  className="btn-remover-subtarefa"
                  title="Remover item"
                >
                  <Trash2 size={13} />
                </button>
              </li>
            ))}
          </ul>

          {/* Adicionar Subtarefa */}
          <form onSubmit={adicionarSubtarefa} className="form-adicionar-subtarefa">
            <input
              type="text"
              placeholder="+ Adicionar um item de checklist..."
              value={novoItemTexto}
              onChange={(e) => setNovoItemTexto(e.target.value)}
              className="input-subtarefa"
            />
            {novoItemTexto.trim() && (
              <button type="submit" className="btn-salvar-subtarefa">
                Adicionar
              </button>
            )}
          </form>
        </div>

        {/* Seção de Comentários */}
        <div className="secao-comentarios-tarefa">
          <div className="cabecalho-comentarios">
            <MessageSquare size={17} className="icone-comentarios" />
            <h4>Comentários da Equipe ({comentarios.length})</h4>
          </div>

          <div className="lista-comentarios">
            {comentarios.map((c) => (
              <div key={c.id} className="item-comentario">
                <Avatar usuario={{ nome: c.autor, email: c.email }} tamanho="sm" />
                <div className="balao-comentario">
                  <div className="topo-comentario">
                    <strong>{c.autor}</strong>
                    <span className="tempo-comentario">{c.tempo}</span>
                  </div>
                  <p className="texto-comentario">{c.texto}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={adicionarComentario} className="form-adicionar-comentario">
            <Avatar usuario={usuarioLogado} tamanho="sm" />
            <div className="input-comentario-wrapper">
              <input
                type="text"
                placeholder="Escreva um comentário ou atualização..."
                value={novoComentario}
                onChange={(e) => setNovoComentario(e.target.value)}
                className="input-comentario"
              />
              <button 
                type="submit" 
                className="btn-enviar-comentario" 
                disabled={!novoComentario.trim()}
                title="Enviar comentário"
              >
                <Send size={15} />
              </button>
            </div>
          </form>
        </div>

        {/* Rodapé do Modal */}
        <div className="modal-rodape-detalhes">
          <button type="button" onClick={aoFechar} className="btn-fechar-detalhe">
            Fechar Detalhes
          </button>
        </div>
      </div>
    </div>
  );
}
