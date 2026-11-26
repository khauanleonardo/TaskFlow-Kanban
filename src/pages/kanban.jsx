// src/pages/kanban.jsx
// Quadro Kanban moderno, com drag-and-drop, filtros avançados, avatares individuais e integração total com a API

import React, { useState, useEffect } from 'react';
import api, { mensagensDeErro } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  ArrowLeft, 
  ArrowRight, 
  Trash2, 
  Pencil, 
  GripVertical,
  ListTodo,
  Clock,
  CheckCircle2,
  FolderKanban,
  User,
  Search,
  Filter,
  Flame,
  AlertCircle,
  X,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import Avatar from '../componentes/Avatar';
import ModalDetalhesTarefa from '../componentes/ModalDetalhesTarefa';
import ModalTarefa from '../componentes/ModalTarefa';
import { MEMBROS_EQUIPE_PADRAO } from '../utils/funcionarios';

function paraNumero(valor) {
  return valor !== '' && valor !== null && valor !== undefined ? Number(valor) : null;
}

function obterMensagensSeguras(e) {
  if (typeof mensagensDeErro === 'function') {
    return mensagensDeErro(e);
  }
  const dados = e?.response?.data?.erro;
  if (dados?.detalhes && Array.isArray(dados.detalhes)) return dados.detalhes;
  if (dados?.mensagem) return [dados.mensagem];
  return ['Ocorreu um erro na requisição.'];
}

const CONFIG_COLUNAS = [
  {
    status: 'afazer',
    rotulosLegados: ['A FAZER', 'todo', 'a fazer'],
    titulo: 'A Fazer',
    subtitulo: 'Aguardando início',
    tag: 'BACKLOG',
    classeCss: 'afazer',
    icone: ListTodo
  },
  {
    status: 'andamento',
    rotulosLegados: ['EM ANDAMENTO', 'doing', 'em andamento'],
    titulo: 'Em Andamento',
    subtitulo: 'Em execução',
    tag: 'EM FOCO',
    classeCss: 'andamento',
    icone: Clock
  },
  {
    status: 'concluido',
    rotulosLegados: ['CONCLUÍDO', 'done', 'concluido', 'concluído'],
    titulo: 'Concluído',
    subtitulo: 'Finalizadas',
    tag: 'ENTREGUE',
    classeCss: 'concluido',
    icone: CheckCircle2
  }
];

export default function Kanban() {
  const { usuario } = useAuth();

  // Dados da API
  const [tarefas, setTarefas] = useState([]);
  const [listaPrioridades, setListaPrioridades] = useState([]);
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [listaProjetos, setListaProjetos] = useState([]);

  // Estados de controle da tela
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Filtros
  const [busca, setBusca] = useState('');
  const [filtroPrioridade, setFiltroPrioridade] = useState('todas');
  const [filtroUsuario, setFiltroUsuario] = useState('todos');

  // Controle de Modais
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEmEdicao, setTarefaEmEdicao] = useState(null);
  const [tarefaParaExcluir, setTarefaParaExcluir] = useState(null);
  const [tarefaSelecionadaDetalhes, setTarefaSelecionadaDetalhes] = useState(null);

  // Coluna sugerida para o modal de criação
  const [colunaDestino, setColunaDestino] = useState('afazer');

  // Drag and Drop
  const [arrastandoId, setArrastandoId] = useState(null);
  const [colunaHover, setColunaHover] = useState(null);

  // Carrega dados iniciais da API
  useEffect(() => {
    carregarTudo();
  }, []);

  async function carregarTudo() {
    setCarregando(true);
    setErro('');
    try {
      const [resT, resPr, resU, resPj] = await Promise.allSettled([
        api.get('/tarefas'),
        api.get('/prioridades'),
        api.get('/usuarios'),
        api.get('/projetos')
      ]);

      if (resT.status === 'fulfilled') {
        const dados = Array.isArray(resT.value.data) ? resT.value.data : [];
        setTarefas(dados);
      } else {
        console.error(resT.reason);
        setErro('Erro ao carregar tarefas. Verifique a conexao.');
      }

      if (resPr.status === 'fulfilled') {
        setListaPrioridades(Array.isArray(resPr.value.data) ? resPr.value.data : []);
      }
      if (resU.status === 'fulfilled') {
        const users = Array.isArray(resU.value.data) ? resU.value.data : [];
        setListaUsuarios(users.length > 0 ? users : MEMBROS_EQUIPE_PADRAO);
      } else {
        setListaUsuarios(MEMBROS_EQUIPE_PADRAO);
      }
      if (resPj.status === 'fulfilled') {
        setListaProjetos(Array.isArray(resPj.value.data) ? resPj.value.data : []);
      }
    } catch (e) {
      console.error(e);
      setErro('Erro ao carregar tarefas. Verifique a conexao.');
    } finally {
      setCarregando(false);
    }
  }

  // Normalização de colunas
  function normalizarColuna(valor) {
    if (!valor) return 'afazer';
    const v = String(valor).toLowerCase().trim();
    if (v === 'todo' || v === 'a fazer' || v === 'afazer') return 'afazer';
    if (v === 'doing' || v === 'em andamento' || v === 'andamento') return 'andamento';
    if (v === 'done' || v === 'concluido' || v === 'concluído') return 'concluido';
    return 'afazer';
  }

  // Mapeamento de prioridades
  function obterPrioridadeNormalizada(tarefa) {
    if (tarefa.refPrioridade?.nome) {
      return tarefa.refPrioridade.nome.toLowerCase();
    }
    if (tarefa.prioridade) {
      return tarefa.prioridade.toLowerCase();
    }
    if (tarefa.idprioridade === 4) return 'urgente';
    if (tarefa.idprioridade === 3) return 'alta';
    if (tarefa.idprioridade === 2) return 'media';
    if (tarefa.idprioridade === 1) return 'baixa';
    return 'media';
  }

  // Abertura do Modal para Criação
  function abrirModalCriacao(colunaSugerida = 'afazer') {
    setTarefaEmEdicao(null);
    setColunaDestino(colunaSugerida);
    setModalAberto(true);
  }

  // Abertura do Modal para Edição
  function abrirModalEdicao(tarefa, e) {
    if (e) e.stopPropagation();
    setTarefaEmEdicao(tarefa);
    setColunaDestino(normalizarColuna(tarefa.coluna));
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setTarefaEmEdicao(null);
  }

  // Chamado pelo ModalTarefa. Se a API recusar, o erro volta para o modal (catch dele)
  async function salvarTarefa(dados) {
    const { id, ...payload } = dados;
    if (id) {
      const resp = await api.put(`/tarefas/${id}`, payload);
      const atualizada = resp?.data || { ...tarefaEmEdicao, ...payload };
      setTarefas((lista) => lista.map((t) => (t.id === id ? atualizada : t)));
    } else {
      const resp = await api.post('/tarefas', dados);
      const criada = resp?.data || { ...payload, id: Date.now() };
      setTarefas((lista) => [...lista, criada]);
    }
  }


  // Exclusão de Tarefa
  async function confirmarExclusao() {
    if (!tarefaParaExcluir) return;
    try {
      await api.delete(`/tarefas/${tarefaParaExcluir.id}`);
      setTarefas(tarefas.filter(t => t.id !== tarefaParaExcluir.id));
      setTarefaParaExcluir(null);
    } catch (err) {
      alert(obterMensagensSeguras(err).join('\n'));
    }
  }

  // Mover coluna via setas rápidas
  async function moverColuna(tarefa, direcao, e) {
    if (e) e.stopPropagation();
    const colunasOrdem = ['afazer', 'andamento', 'concluido'];
    const colunaAtual = normalizarColuna(tarefa.coluna);
    const indexAtual = colunasOrdem.indexOf(colunaAtual);
    const novoIndex = indexAtual + direcao;

    if (novoIndex < 0 || novoIndex >= colunasOrdem.length) return;
    const novaColuna = colunasOrdem[novoIndex];

    try {
      await api.put(`/tarefas/${tarefa.id}`, { coluna: novaColuna });
      setTarefas(tarefas.map(t => t.id === tarefa.id ? { ...t, coluna: novaColuna } : t));
    } catch (err) {
      alert(obterMensagensSeguras(err).join('\n'));
    }
  }

  // Drag and Drop Nativo
  function lidarComDragStart(e, id) {
    setArrastandoId(id);
    e.dataTransfer.setData('text/plain', String(id));
  }

  function lidarComDragOver(e, status) {
    e.preventDefault();
    setColunaHover(status);
  }

  function lidarComDragLeave() {
    setColunaHover(null);
  }

  async function lidarComDrop(e, novoStatus) {
    e.preventDefault();
    setColunaHover(null);
    const id = arrastandoId || Number(e.dataTransfer.getData('text/plain'));
    if (!id) return;

    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa || normalizarColuna(tarefa.coluna) === novoStatus) return;

    try {
      await api.put(`/tarefas/${id}`, { coluna: novoStatus });
      setTarefas(tarefas.map(t => t.id === id ? { ...t, coluna: novoStatus } : t));
    } catch (err) {
      alert(obterMensagensSeguras(err).join('\n'));
    } finally {
      setArrastandoId(null);
    }
  }

  // Filtragem de tarefas
  const tarefasFiltradas = tarefas.filter((t) => {
    // Filtro por texto
    if (busca.trim()) {
      const termo = busca.toLowerCase();
      const titulo = (t.texto || t.titulo || '').toLowerCase();
      const desc = (t.descricao || '').toLowerCase();
      const usuarioResp = (t.usuario_nome || t.usuario?.nome || '').toLowerCase();
      const projeto = (t.projeto_nome || t.projeto?.nome || '').toLowerCase();
      if (!titulo.includes(termo) && !desc.includes(termo) && !usuarioResp.includes(termo) && !projeto.includes(termo)) {
        return false;
      }
    }

    // Filtro por Prioridade
    if (filtroPrioridade !== 'todas') {
      const prioridadeNormal = obterPrioridadeNormalizada(t);
      if (prioridadeNormal !== filtroPrioridade.toLowerCase()) {
        return false;
      }
    }

    // Filtro por Usuário
    if (filtroUsuario !== 'todos') {
      if (String(t.usuario_id) !== String(filtroUsuario)) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="kanban-container">
      {/* Cabeçalho e Barra de Ferramentas */}
      <div className="kanban-topo-bloco">
        <div className="kanban-titulo-secao">
          <div>
            <h1>Quadro Kanban de Tarefas</h1>
            <p>Acompanhe demandas em tempo real com prioridades, prazos e membros responsáveis.</p>
          </div>

          <button
            type="button"
            className="btn-nova-tarefa-destaque"
            onClick={() => abrirModalCriacao('afazer')}
          >
            <Plus size={18} />
            <span>Nova Tarefa</span>
          </button>
        </div>

        {/* Barra de Filtros */}
        <div className="kanban-barra-filtros">
          {/* Busca textual */}
          <div className="busca-kanban-wrapper">
            <Search size={16} className="icone-busca-filtro" />
            <input
              type="text"
              placeholder="Filtrar por nome, descrição ou projeto..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="input-busca-kanban"
            />
            {busca && (
              <button onClick={() => setBusca('')} className="btn-limpar-busca" title="Limpar">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Chips de Prioridade */}
          <div className="chips-prioridade-grupo">
            <span className="rotulo-filtro-chips">Prioridade:</span>
            {['todas', 'urgente', 'alta', 'media', 'baixa'].map((p) => (
              <button
                key={p}
                type="button"
                className={`chip-filtro ${filtroPrioridade === p ? 'ativo' : ''} chip-${p}`}
                onClick={() => setFiltroPrioridade(p)}
              >
                <span className={`ponto-chip ${p}`}></span>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>

          {/* Seletor de Responsável */}
          <div className="seletor-membro-wrapper">
            <User size={15} className="icone-select-filtro" />
            <select
              value={filtroUsuario}
              onChange={(e) => setFiltroUsuario(e.target.value)}
              className="select-filtro-usuario"
            >
              <option value="todos">Todos os Responsáveis</option>
              {listaUsuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {carregando && (
        <p className="kanban-carregando">Carregando tarefas...</p>
      )}

      {erro && (
        <div className="alerta-erro-kanban">
          <AlertCircle size={18} />
          <span>{erro}</span>
          <button onClick={carregarTudo} className="btn-tentar-novamente">Recarregar</button>
        </div>
      )}

      {/* As 3 Colunas Kanban */}
      <div className="colunas-kanban-grid">
        {CONFIG_COLUNAS.map((col) => {
          const tarefasDaColuna = tarefasFiltradas.filter(
            (t) => normalizarColuna(t.coluna) === col.status
          );
          const IconeColuna = col.icone;
          const estaHover = colunaHover === col.status;

          return (
            <div
              key={col.status}
              className={`coluna-kanban coluna-${col.classeCss} ${estaHover ? 'coluna-drag-over' : ''}`}
              onDragOver={(e) => lidarComDragOver(e, col.status)}
              onDragLeave={lidarComDragLeave}
              onDrop={(e) => lidarComDrop(e, col.status)}
            >
              {/* Topo da Coluna */}
              <div className="coluna-cabecalho">
                <div className="coluna-titulo-info">
                  <div className={`icone-coluna-wrapper ${col.classeCss}`}>
                    <IconeColuna size={17} />
                  </div>
                  <div>
                    <h3 className="titulo-coluna-texto">{col.titulo}</h3>
                    <span className="tag-coluna-sub">{col.tag}</span>
                  </div>
                </div>

                <div className="coluna-acoes-topo">
                  <span className="contador-pilula-tarefas">
                    {tarefasDaColuna.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => abrirModalCriacao(col.status)}
                    className="btn-add-tarefa-coluna"
                    title={`Nova tarefa em ${col.titulo}`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Lista de Cards da Coluna */}
              <div className="lista-cards-coluna">
                {tarefasDaColuna.length === 0 ? (
                  <div className="coluna-vazia-placeholder">
                    <p>Nenhuma tarefa nesta etapa</p>
                    <button 
                      type="button" 
                      onClick={() => abrirModalCriacao(col.status)} 
                      className="btn-criar-vazio"
                    >
                      + Criar tarefa
                    </button>
                  </div>
                ) : (
                  tarefasDaColuna.map((tarefa) => {
                    const prioridade = obterPrioridadeNormalizada(tarefa);
                    const usuarioResp = listaUsuarios.find(u => u.id === tarefa.usuario_id) || {
                      nome: tarefa.usuario_nome || 'Responsável',
                      id: tarefa.usuario_id
                    };
                    const projetoNome = tarefa.projeto_nome || tarefa.projeto?.nome || 'TaskFlow Core';

                    return (
                      <div
                        key={tarefa.id}
                        draggable
                        onDragStart={(e) => lidarComDragStart(e, tarefa.id)}
                        onClick={() => setTarefaSelecionadaDetalhes(tarefa)}
                        className={`card-tarefa-kanban prioridade-${prioridade}`}
                      >
                        {/* Linha Superior: Tag do Projeto e Prioridade */}
                        <div className="card-linha-superior">
                          <span className="chip-projeto-tag">
                            <FolderKanban size={11} />
                            {projetoNome}
                          </span>

                          <span className={`badge-prioridade-card badge-${prioridade}`}>
                            <span className="ponto-prioridade"></span>
                            {prioridade.toUpperCase()}
                          </span>
                        </div>

                        {/* Título e Descrição */}
                        <div className="card-corpo-conteudo">
                          <h4 className="titulo-tarefa-card">
                            {tarefa.texto || tarefa.titulo}
                          </h4>
                          {tarefa.descricao && (
                            <p className="descricao-tarefa-card">
                              {tarefa.descricao}
                            </p>
                          )}
                        </div>

                        {/* Linha Inferior: Responsável com Avatar e Ações Rápidas */}
                        <div className="card-rodape-acoes">
                          <div className="membro-responsavel-box" title={`Responsável: ${usuarioResp.nome}`}>
                            <Avatar usuario={usuarioResp} tamanho="sm" online={true} />
                            <span className="nome-responsavel-card">{usuarioResp.nome}</span>
                          </div>

                          <div className="botoes-acoes-card" onClick={(e) => e.stopPropagation()}>
                            {/* Mover para esquerda */}
                            {col.status !== 'afazer' && (
                              <button
                                type="button"
                                onClick={(e) => moverColuna(tarefa, -1, e)}
                                className="btn-acao-card btn-mover"
                                title="Mover para coluna anterior"
                              >
                                <ArrowLeft size={13} />
                              </button>
                            )}

                            {/* Mover para direita */}
                            {col.status !== 'concluido' && (
                              <button
                                type="button"
                                onClick={(e) => moverColuna(tarefa, 1, e)}
                                className="btn-acao-card btn-mover"
                                title="Avançar para próxima coluna"
                              >
                                <ArrowRight size={13} />
                              </button>
                            )}

                            {/* Editar */}
                            <button
                              type="button"
                              onClick={(e) => abrirModalEdicao(tarefa, e)}
                              className="btn-acao-card btn-editar"
                              title="Editar tarefa"
                            >
                              <Pencil size={13} />
                            </button>

                            {/* Excluir */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTarefaParaExcluir(tarefa);
                              }}
                              className="btn-acao-card btn-excluir"
                              title="Excluir tarefa"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Criação / Edição */}
      <ModalTarefa
        aberto={modalAberto}
        tarefa={tarefaEmEdicao}
        coluna={colunaDestino}
        onFechar={fecharModal}
        onSalvar={salvarTarefa}
        prioridades={listaPrioridades}
        usuarios={listaUsuarios}
        projetos={listaProjetos}
      />


      {/* Modal de Exclusão */}
      {tarefaParaExcluir && (
        <div className="modal-overlay" onClick={() => setTarefaParaExcluir(null)}>
          <div 
            className="modal-content modal-excluir-box" 
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-cabecalho-excluir">
              <Trash2 size={24} className="icone-lixeira-alerta" />
              <h3>Excluir tarefa?</h3>
              <p>
                Tem certeza que deseja remover <strong>"{tarefaParaExcluir.texto || tarefaParaExcluir.titulo}"</strong>? Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="modal-acoes-excluir">
              <button onClick={() => setTarefaParaExcluir(null)} className="btn-cancelar">
                Cancelar
              </button>
              <button onClick={confirmarExclusao} className="btn-confirmar-exclusao">
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rico de Detalhes da Tarefa */}
      <ModalDetalhesTarefa
        tarefa={tarefaSelecionadaDetalhes}
        aberto={Boolean(tarefaSelecionadaDetalhes)}
        aoFechar={() => setTarefaSelecionadaDetalhes(null)}
        listaPrioridades={listaPrioridades}
        listaUsuarios={listaUsuarios}
        listaProjetos={listaProjetos}
      />
    </div>
  );
}
