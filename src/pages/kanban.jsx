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
  Activity
} from 'lucide-react';

function paraNumero(valor) {
  return valor !== '' && valor !== null && valor !== undefined ? Number(valor) : null;
}

const CONFIG_COLUNAS = [
  {
    status: 'afazer',
    rotulosLegados: ['A FAZER', 'todo'],
    titulo: 'A Fazer',
    subtitulo: 'Aguardando início',
    tag: 'BACKLOG',
    classeCss: 'afazer',
    icone: ListTodo
  },
  {
    status: 'andamento',
    rotulosLegados: ['EM ANDAMENTO', 'doing'],
    titulo: 'Em Andamento',
    subtitulo: 'Em execução',
    tag: 'EM FOCO',
    classeCss: 'andamento',
    pulsar: true,
    icone: Clock
  },
  {
    status: 'concluido',
    rotulosLegados: ['CONCLUÍDO', 'done'],
    titulo: 'Concluído',
    subtitulo: 'Finalizadas',
    tag: 'ENTREGUE',
    classeCss: 'concluido',
    icone: CheckCircle2
  }
];

export default function Kanban() {
  const { usuario } = useAuth();

  // Dados vindos da API (Passo 4 - Slide 9)
  const [tarefas, setTarefas] = useState([]);
  const [listaPrioridades, setListaPrioridades] = useState([]);
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [listaProjetos, setListaProjetos] = useState([]);

  // Estados de controle da tela
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Filtros de busca e prioridade no topo (Layout das fotos)
  const [busca, setBusca] = useState('');
  const [filtroPrioridade, setFiltroPrioridade] = useState('TODAS');

  // Drag and drop
  const [cardArrastadoId, setCardArrastadoId] = useState(null);
  const [colunaSobrevoada, setColunaSobrevoada] = useState(null);

  // Modais
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEmEdicao, setTarefaEmEdicao] = useState(null);
  const [tarefaParaExcluir, setTarefaParaExcluir] = useState(null);

  // Formulário do Modal
  const [texto, setTexto] = useState('');
  const [descricao, setDescricao] = useState('');
  const [idPrioridade, setIdPrioridade] = useState(2); // 2 = Médio
  const [colunaDestino, setColunaDestino] = useState('afazer');
  const [idUsuario, setIdUsuario] = useState('');
  const [idProjeto, setIdProjeto] = useState('');
  const [errosModal, setErrosModal] = useState([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setCarregando(true);
      setErro('');

      const [respPrioridades, respTarefas, respUsuarios, respProjetos] = await Promise.all([
        api.get('/prioridades'),
        api.get('/tarefas'),
        api.get('/usuarios'),
        api.get('/projetos')
      ]);

      setListaPrioridades(respPrioridades.data || []);
      setTarefas(respTarefas.data || []);
      setListaUsuarios(respUsuarios.data || []);
      setListaProjetos(respProjetos.data || []);
    } catch (e) {
      setErro(mensagensDeErro(e).join(' '));
    } finally {
      setCarregando(false);
    }
  }

  function abrirNovo(coluna) {
    setTarefaEmEdicao(null);
    setColunaDestino(coluna || 'afazer');
    setTexto('');
    setDescricao('');
    setIdPrioridade(2); // Médio padrão
    setIdUsuario(usuario?.id ? String(usuario.id) : (listaUsuarios[0]?.id ? String(listaUsuarios[0].id) : ''));
    setIdProjeto(listaProjetos[0]?.id ? String(listaProjetos[0].id) : '');
    setErrosModal([]);
    setModalAberto(true);
  }

  function abrirEdicao(t) {
    setTarefaEmEdicao(t);
    setColunaDestino(t.coluna || 'afazer');
    setTexto(t.texto || t.titulo || '');
    setDescricao(t.descricao || '');
    setIdPrioridade(t.idprioridade || 2);
    setIdUsuario(t.usuario_id ? String(t.usuario_id) : (usuario?.id ? String(usuario.id) : ''));
    setIdProjeto(t.projeto_id ? String(t.projeto_id) : (listaProjetos[0]?.id ? String(listaProjetos[0].id) : ''));
    setErrosModal([]);
    setModalAberto(true);
  }

  async function salvarTarefa(dados) {
    if (dados.id) {
      const resposta = await api.put(`/tarefas/${dados.id}`, dados);
      setTarefas((prev) => prev.map((t) => (t.id === dados.id ? resposta.data : t)));
    } else {
      const resposta = await api.post('/tarefas', dados);
      setTarefas((prev) => [...prev, resposta.data]);
    }
  }

  async function handleSalvar(e) {
    if (e) e.preventDefault();
    setErrosModal([]);
    setSalvando(true);

    try {
      await salvarTarefa({
        ...tarefaEmEdicao,
        id: tarefaEmEdicao?.id,
        texto,
        descricao,
        coluna: colunaDestino,
        idprioridade: paraNumero(idPrioridade),
        usuario_id: paraNumero(idUsuario),
        projeto_id: paraNumero(idProjeto)
      });
      setModalAberto(false);
    } catch (err) {
      setErrosModal(mensagensDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  async function moverTarefa(id, novaColuna) {
    const tarefa = tarefas.find((t) => t.id === id);
    if (!tarefa) return;

    setTarefas((prev) => prev.map((t) => (t.id === id ? { ...t, coluna: novaColuna } : t)));

    try {
      const resposta = await api.put(`/tarefas/${id}`, {
        ...tarefa,
        id,
        texto: tarefa.texto || tarefa.titulo,
        coluna: novaColuna,
        descricao: tarefa.descricao || '',
        idprioridade: tarefa.idprioridade || 2,
        usuario_id: tarefa.usuario_id || 1,
        projeto_id: tarefa.projeto_id || 1
      });
      setTarefas((prev) => prev.map((t) => (t.id === id ? resposta.data : t)));
    } catch (e) {
      alert(mensagensDeErro(e).join('\n'));
      carregarDados();
    }
  }

  async function confirmarExclusao() {
    if (!tarefaParaExcluir) return;
    try {
      await api.delete(`/tarefas/${tarefaParaExcluir.id}`);
      setTarefas((prev) => prev.filter((t) => t.id !== tarefaParaExcluir.id));
      setTarefaParaExcluir(null);
    } catch (e) {
      alert(mensagensDeErro(e).join('\n'));
    }
  }

  // Drag and drop
  function handleDragStart(e, id) {
    setCardArrastadoId(id);
    e.dataTransfer.setData('text/plain', String(id));
  }

  function handleDragOver(e, colunaStatus) {
    e.preventDefault();
    if (colunaSobrevoada !== colunaStatus) setColunaSobrevoada(colunaStatus);
  }

  function handleDrop(e, novaColunaStatus) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || cardArrastadoId;
    if (id) {
      moverTarefa(Number(id) || id, novaColunaStatus);
    }
    setCardArrastadoId(null);
    setColunaSobrevoada(null);
  }

  function tarefaPertenceAColuna(t, configCol) {
    const colAtual = String(t.coluna || t.status || '').toLowerCase();
    if (colAtual === configCol.status.toLowerCase()) return true;
    return configCol.rotulosLegados.some((leg) => leg.toLowerCase() === colAtual);
  }

  function obterClassePrioridade(t) {
    const mapaId = { 1: 'baixa', 2: 'media', 3: 'alta', 4: 'urgente' };
    if (t.idprioridade && mapaId[t.idprioridade]) return mapaId[t.idprioridade];
    const textoP = String(t.prioridade || '').toLowerCase();
    if (textoP.includes('baix')) return 'baixa';
    if (textoP.includes('alt')) return 'alta';
    if (textoP.includes('urg')) return 'urgente';
    return 'media';
  }

  // Estatísticas e contadores gerais
  const total = tarefas.length;
  const concluidas = tarefas.filter((t) => {
    const col = String(t.coluna || t.status || '').toLowerCase();
    return col === 'concluido' || col === 'done';
  }).length;
  const pendentes = total - concluidas;
  const sprintPorcentagem = total > 0 ? Math.round((concluidas / total) * 100) : 0;

  // Contadores por prioridade para os filtros
  const contagemAlta = tarefas.filter((t) => obterClassePrioridade(t) === 'alta').length;
  const contagemMedia = tarefas.filter((t) => obterClassePrioridade(t) === 'media').length;
  const contagemBaixa = tarefas.filter((t) => obterClassePrioridade(t) === 'baixa').length;
  const contagemUrgente = tarefas.filter((t) => obterClassePrioridade(t) === 'urgente').length;

  // Filtragem das tarefas exibidas
  const tarefasFiltradas = tarefas.filter((t) => {
    const termo = busca.toLowerCase().trim();
    const textoTarefa = String(t.texto || t.titulo || '').toLowerCase();
    const descTarefa = String(t.descricao || '').toLowerCase();
    const matchBusca = !termo || textoTarefa.includes(termo) || descTarefa.includes(termo);

    const classeP = obterClassePrioridade(t);
    const matchPrioridade = 
      filtroPrioridade === 'TODAS' ||
      (filtroPrioridade === 'ALTA' && classeP === 'alta') ||
      (filtroPrioridade === 'MEDIA' && classeP === 'media') ||
      (filtroPrioridade === 'BAIXA' && classeP === 'baixa') ||
      (filtroPrioridade === 'URGENTE' && classeP === 'urgente');

    return matchBusca && matchPrioridade;
  });

  return (
    <div className="kanban-page">
      {/* Cabeçalho com Título e Badges da foto */}
      <header className="kanban-header">
        <div>
          <h1>TaskFlow</h1>
          <p>Gerencie suas tarefas com facilidade</p>
        </div>
        <div className="contadores">
          <span className="contador-total">
            <span className="bolinha-status total"></span> Total {total}
          </span>
          <span className="contador-pendente">
            <span className="bolinha-status pendente"></span> Pendentes {pendentes}
          </span>
          <span className="contador-concluida">
            <span className="bolinha-status concluida"></span> Concluídas {concluidas}
          </span>
        </div>
      </header>

      {/* Barra de Sprint da foto */}
      <div className="sprint-container">
        <div className="sprint-esquerda">
          <span className="sprint-icone"><Activity size={16} /></span>
          <span className="sprint-titulo">Sprint: {sprintPorcentagem}%</span>
          <div className="sprint-trilha">
            <div className="sprint-barra" style={{ width: `${sprintPorcentagem}%` }}></div>
          </div>
        </div>
        <div className="sprint-direita">
          <span>{concluidas}/{total} entregues</span>
        </div>
      </div>

      {/* Barra de Pesquisa e Filtros de Prioridade da foto */}
      <div className="controles-barra">
        <div className="campo-pesquisa">
          <Search size={16} className="icone-lupa" />
          <input
            type="text"
            placeholder="Buscar tarefas..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className="filtros-prioridade">
          <span className="filtro-rotulo">
            <Filter size={14} /> Prioridade:
          </span>
          <button
            type="button"
            className={`btn-chip ${filtroPrioridade === 'TODAS' ? 'ativo' : ''}`}
            onClick={() => setFiltroPrioridade('TODAS')}
          >
            Todas <span className="chip-badge">{total}</span>
          </button>
          <button
            type="button"
            className={`btn-chip ${filtroPrioridade === 'ALTA' ? 'ativo' : ''}`}
            onClick={() => setFiltroPrioridade('ALTA')}
          >
            <span className="bolinha-filtro alta"></span> Alta <span className="chip-badge">{contagemAlta}</span>
          </button>
          <button
            type="button"
            className={`btn-chip ${filtroPrioridade === 'MEDIA' ? 'ativo' : ''}`}
            onClick={() => setFiltroPrioridade('MEDIA')}
          >
            <span className="bolinha-filtro media"></span> Média <span className="chip-badge">{contagemMedia}</span>
          </button>
          <button
            type="button"
            className={`btn-chip ${filtroPrioridade === 'BAIXA' ? 'ativo' : ''}`}
            onClick={() => setFiltroPrioridade('BAIXA')}
          >
            <span className="bolinha-filtro baixa"></span> Baixa <span className="chip-badge">{contagemBaixa}</span>
          </button>
          {contagemUrgente > 0 && (
            <button
              type="button"
              className={`btn-chip ${filtroPrioridade === 'URGENTE' ? 'ativo' : ''}`}
              onClick={() => setFiltroPrioridade('URGENTE')}
            >
              <span className="bolinha-filtro urgente"></span> Urgente <span className="chip-badge">{contagemUrgente}</span>
            </button>
          )}
        </div>
      </div>

      {erro && <div className="erro-alerta">{erro}</div>}
      {carregando && <p className="loading-texto">Carregando quadro...</p>}

      {/* Grade de Colunas */}
      <div className="kanban-colunas">
        {CONFIG_COLUNAS.map((coluna) => {
          const tarefasDaColuna = tarefasFiltradas.filter((t) => tarefaPertenceAColuna(t, coluna));
          const totalNaColunaSemFiltro = tarefas.filter((t) => tarefaPertenceAColuna(t, coluna)).length;
          const isOver = colunaSobrevoada === coluna.status;
          const IconeColuna = coluna.icone;
          const porcentagem = total > 0 ? Math.round((totalNaColunaSemFiltro / total) * 100) : 0;

          return (
            <div
              key={coluna.status}
              className={`coluna coluna-${coluna.classeCss} ${isOver ? 'coluna-drop-hover' : ''}`}
              onDragOver={(e) => handleDragOver(e, coluna.status)}
              onDragLeave={() => setColunaSobrevoada(null)}
              onDrop={(e) => handleDrop(e, coluna.status)}
            >
              <div className="coluna-cabecalho-detalhado">
                <div className="coluna-linha-principal">
                  <div className="coluna-info-grupo">
                    <div className="coluna-icone-caixa">
                      <IconeColuna size={17} />
                    </div>
                    <div className="coluna-titulos-box">
                      <h3>
                        {coluna.titulo}
                        <span className="badge-count">{tarefasDaColuna.length}</span>
                      </h3>
                      <span className="coluna-subtitulo">{coluna.subtitulo}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span className={`coluna-badge-status ${coluna.classeCss}`}>
                      {coluna.pulsar && <span className="ponto-pulso"></span>}
                      {coluna.tag}
                    </span>

                    <button 
                      onClick={() => abrirNovo(coluna.status)} 
                      className="btn-add-mini" 
                      title={`Adicionar em ${coluna.titulo}`}
                      type="button"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>

                <div className="coluna-progresso-container" title={`${porcentagem}% do total de tarefas`}>
                  <div className="coluna-progresso-trilha">
                    <div className="coluna-progresso-barra" style={{ width: `${porcentagem}%` }} />
                  </div>
                  <span className="coluna-progresso-valor">{porcentagem}%</span>
                </div>
              </div>

              {/* Lista de Cards com borda esquerda colorida */}
              <div className="lista-cards">
                {tarefasDaColuna.map((tarefa) => {
                  const arrastandoEste = cardArrastadoId === tarefa.id;

                  const prioridadeObj = listaPrioridades.find((p) => p.id === tarefa.idprioridade);
                  const rotuloPrioridade = prioridadeObj?.descricao || prioridadeObj?.nome || tarefa.prioridade || 'Média';
                  const classePrioridade = obterClassePrioridade(tarefa);

                  const respObj = listaUsuarios.find((u) => u.id === tarefa.usuario_id);
                  const projObj = listaProjetos.find((p) => p.id === tarefa.projeto_id);

                  return (
                    <div
                      key={tarefa.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, tarefa.id)}
                      onDragEnd={() => {
                        setCardArrastadoId(null);
                        setColunaSobrevoada(null);
                      }}
                      className={`card-tarefa borda-${classePrioridade} ${arrastandoEste ? 'arrastando' : ''}`}
                    >
                      <div className="card-cabecalho">
                        <div className="card-info-principal">
                          <span className="drag-handle" title="Arraste para mover de coluna">
                            <GripVertical size={14} />
                          </span>
                          <div>
                            <h4>{tarefa.texto || tarefa.titulo}</h4>
                            {tarefa.descricao && (
                              <p className="card-descricao-texto">{tarefa.descricao}</p>
                            )}
                            <div className="card-meta-linha">
                              {respObj && (
                                <span className="badge-meta responsavel">
                                  <User size={12} /> {respObj.nome}
                                </span>
                              )}
                              {projObj && (
                                <span className="badge-meta projeto">
                                  <FolderKanban size={12} /> {projObj.nome}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <span className={`badge-prioridade ${classePrioridade}`}>
                          <span className="bolinha-prioridade" />
                          {rotuloPrioridade.toUpperCase()}
                        </span>
                      </div>

                      <div className="card-rodape">
                        <div className="acoes-card">
                          {coluna.status === 'andamento' && (
                            <button onClick={() => moverTarefa(tarefa.id, 'afazer')} title="Voltar para A Fazer">
                              <ArrowLeft size={14} />
                            </button>
                          )}
                          {coluna.status === 'concluido' && (
                            <button onClick={() => moverTarefa(tarefa.id, 'andamento')} title="Voltar para Em Andamento">
                              <ArrowLeft size={14} />
                            </button>
                          )}
                          {coluna.status === 'afazer' && (
                            <button onClick={() => moverTarefa(tarefa.id, 'andamento')} title="Avançar para Em Andamento">
                              <ArrowRight size={14} />
                            </button>
                          )}
                          {coluna.status === 'andamento' && (
                            <button onClick={() => moverTarefa(tarefa.id, 'concluido')} title="Concluir tarefa">
                              <ArrowRight size={14} />
                            </button>
                          )}
                          <button onClick={() => abrirEdicao(tarefa)} title="Editar">
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => setTarefaParaExcluir(tarefa)} className="btn-excluir" title="Excluir">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {tarefasDaColuna.length === 0 && (
                  <div className="coluna-vazia">
                    <IconeColuna size={26} style={{ opacity: 0.3 }} />
                    <p>Nenhuma tarefa em {coluna.titulo.toLowerCase()}</p>
                    <span>Arraste um card ou clique no + acima</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Rico com bolinhas coloridas, selects e coluna destino */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header-box">
              <h3>{tarefaEmEdicao ? 'Editar tarefa' : 'Nova tarefa'}</h3>
              <p>Defina a prioridade, a coluna, o responsável e o projeto.</p>
            </div>

            <form onSubmit={handleSalvar}>
              <div className="form-group">
                <label htmlFor="tarefa-texto">Título</label>
                <input
                  id="tarefa-texto"
                  name="texto"
                  type="text"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder="Ex.: Revisar relatório"
                />
              </div>

              <div className="form-group">
                <label htmlFor="tarefa-descricao">Descrição</label>
                <textarea
                  id="tarefa-descricao"
                  name="descricao"
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Detalhes da tarefa"
                />
              </div>

              {/* Linha dupla: Prioridade com Bolinha e Coluna Destino */}
              <div className="form-linha-dupla">
                <div className="form-group">
                  <label htmlFor="tarefa-prioridade">Prioridade</label>
                  <div className="select-com-indicador">
                    <span className={`bolinha-select ${
                      Number(idPrioridade) === 1 ? 'baixa' :
                      Number(idPrioridade) === 3 ? 'alta' :
                      Number(idPrioridade) === 4 ? 'urgente' : 'media'
                    }`}></span>
                    <select
                      id="tarefa-prioridade"
                      name="idprioridade"
                      value={idPrioridade}
                      onChange={(e) => setIdPrioridade(e.target.value)}
                    >
                      {listaPrioridades.map((pr) => (
                        <option key={pr.id} value={pr.id}>
                          {pr.descricao || pr.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="tarefa-coluna">Coluna Destino</label>
                  <div className="select-com-indicador">
                    <span className={`bolinha-select coluna-${colunaDestino}`}></span>
                    <select
                      id="tarefa-coluna"
                      name="coluna"
                      value={colunaDestino}
                      onChange={(e) => setColunaDestino(e.target.value)}
                    >
                      <option value="afazer">A Fazer</option>
                      <option value="andamento">Em Andamento</option>
                      <option value="concluido">Concluído</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Linha dupla: Responsável e Projeto */}
              <div className="form-linha-dupla">
                <div className="form-group">
                  <label htmlFor="tarefa-responsavel">Responsável</label>
                  <div className="select-com-indicador">
                    <User size={14} className="icone-select-usuario" />
                    <select
                      id="tarefa-responsavel"
                      name="usuario_id"
                      value={idUsuario}
                      onChange={(e) => setIdUsuario(e.target.value)}
                    >
                      {listaUsuarios.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="tarefa-projeto">Projeto</label>
                  <div className="select-com-indicador">
                    <FolderKanban size={14} className="icone-select-projeto" />
                    <select
                      id="tarefa-projeto"
                      name="projeto_id"
                      value={idProjeto}
                      onChange={(e) => setIdProjeto(e.target.value)}
                    >
                      {listaProjetos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Lista de Erros do Modal (Passo 11 - Slide 18) */}
              {errosModal.length > 0 && (
                <ul className="modal-erros">
                  {errosModal.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              )}

              <div className="modal-acoes">
                <button type="button" onClick={() => setModalAberto(false)} className="btn-cancelar">
                  Cancelar
                </button>
                <button type="submit" className="btn-salvar" disabled={salvando}>
                  {salvando ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Exclusão */}
      {tarefaParaExcluir && (
        <div className="modal-overlay">
          <div className="modal-content modal-excluir-box">
            <div className="modal-header-box">
              <h3>Excluir "{tarefaParaExcluir.texto || tarefaParaExcluir.titulo}"?</h3>
              <p>Esta ação não pode ser desfeita e removerá a tarefa do quadro.</p>
            </div>
            <div className="modal-acoes">
              <button onClick={() => setTarefaParaExcluir(null)} className="btn-cancelar">Cancelar</button>
              <button onClick={confirmarExclusao} className="btn-confirmar-exclusao">Excluir tarefa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}