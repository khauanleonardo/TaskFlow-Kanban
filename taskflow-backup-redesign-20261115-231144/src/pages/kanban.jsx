import React, { useState, useEffect, useMemo } from 'react';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  ArrowLeft, 
  ArrowRight, 
  Trash2, 
  Pencil, 
  MapPin, 
  GripVertical,
  ListTodo,
  Clock,
  CheckCircle2
} from 'lucide-react';

// Configuração visual rica para cada coluna
const CONFIG_COLUNAS = [
  { status: 'afazer', titulo: 'A Fazer', subtitulo: 'Aguardando início', tag: 'Backlog', classeCss: 'afazer', icone: ListTodo },
  { status: 'andamento', titulo: 'Em Andamento', subtitulo: 'Em execução', tag: 'Em foco', classeCss: 'andamento', pulsar: true, icone: Clock },
  { status: 'concluido', titulo: 'Concluído', subtitulo: 'Finalizadas', tag: 'Entregue', classeCss: 'concluido', icone: CheckCircle2 },
];
const normalizeText = (value = '') => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const normalizePriority = (value = '') => normalizeText(value).replace(/\s+/g, '');
const normalizeColumn = (value = '') => {
  const v = normalizeText(value).replace(/\s+/g, '');
  if (['afazer', 'todo', 'backlog'].includes(v)) return 'afazer';
  if (['andamento', 'emandamento', 'doing', 'emfoco'].includes(v)) return 'andamento';
  if (['concluido', 'done'].includes(v)) return 'concluido';
  return v;
};


export default function Kanban() {
  const { usuario } = useAuth();
  const [prioridades, setPrioridades] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [usuarioId, setUsuarioId] = useState('');
  const [projetoId, setProjetoId] = useState('');
  const [filtroPrioridade, setFiltroPrioridade] = useState('todas');
  const [busca, setBusca] = useState('');
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Drag and drop
  const [cardArrastadoId, setCardArrastadoId] = useState(null);
  const [colunaSobrevoada, setColunaSobrevoada] = useState(null);

  // Modais
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEmEdicao, setTarefaEmEdicao] = useState(null);
  const [tarefaParaExcluir, setTarefaParaExcluir] = useState(null);

  // Formulário
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridadeId, setPrioridadeId] = useState('');
  const [colunaDestino, setColunaDestino] = useState('afazer');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [bairro, setBairro] = useState('');
  const [rua, setRua] = useState('');
  const [buscandoCep, setBuscandoCep] = useState(false);

  useEffect(() => {
    carregarInicial();
  }, []);

  async function carregarInicial() {
    setCarregando(true);
    try {
      const [tarefasRes, prioRes, usuariosRes, projetosRes] = await Promise.all([
        api.get('/tarefas'), api.get('/prioridades'), api.get('/usuarios'), api.get('/projetos')
      ]);
      setTarefas(Array.isArray(tarefasRes.data) ? tarefasRes.data : []);
      setPrioridades(Array.isArray(prioRes.data) ? prioRes.data : []);
      setUsuarios(Array.isArray(usuariosRes.data) ? usuariosRes.data : []);
      setProjetos(Array.isArray(projetosRes.data) ? projetosRes.data : []);
    } catch (e) {
      setErro('Não foi possível carregar os dados. Confirme a API, o login e a conexão com o banco.');
    } finally { setCarregando(false); }
  }

  async function carregarTarefas() {
    try {
      setCarregando(true);
      setErro('');
      const resposta = await api.get('/tarefas');
      setTarefas(Array.isArray(resposta.data) ? resposta.data : []);
    } catch (e) {
      setErro('Erro ao carregar tarefas. Verifique se a API está ligada.');
    } finally {
      setCarregando(false);
    }
  }

  // Permite APENAS números de 0 a 9 e insere o hífen automaticamente
  function handleCepChange(e) {
    const apenasNumeros = e.target.value.replace(/\D/g, '');
    if (apenasNumeros.length > 8) return;

    let formatado = apenasNumeros;
    if (apenasNumeros.length > 5) {
      formatado = `${apenasNumeros.slice(0, 5)}-${apenasNumeros.slice(5)}`;
    }
    setCep(formatado);

    if (apenasNumeros.length === 8) {
      consultarViaCep(apenasNumeros);
    }
  }

  async function consultarViaCep(digitos) {
    try {
      setBuscandoCep(true);
      const res = await fetch(`https://viacep.com.br/ws/${digitos}/json/`);
      const dados = await res.json();
      if (!dados.erro) {
        setCidade(dados.localidade || '');
        setUf(dados.uf || '');
        setBairro(dados.bairro || '');
        setRua(dados.logradouro || '');
      }
    } catch (err) {
      console.error('Erro no ViaCEP', err);
    } finally {
      setBuscandoCep(false);
    }
  }

  function abrirNovo(coluna) {
    setTarefaEmEdicao(null);
    setColunaDestino(coluna);
    setTitulo('');
    setDescricao('');
    setPrioridadeId(String(prioridades.find(p => normalizePriority(p.nome) === 'media')?.id || prioridades[0]?.id || ''));
    setUsuarioId(String(usuario?.id || usuarios[0]?.id || ''));
    setProjetoId(String(projetos[0]?.id || ''));
    setCep('');
    setCidade('');
    setUf('');
    setBairro('');
    setRua('');
    setModalAberto(true);
  }

  function abrirEdicao(t) {
    setTarefaEmEdicao(t);
    setColunaDestino(normalizeColumn(t.coluna) || 'afazer');
    setTitulo(t.titulo || '');
    setDescricao(t.descricao || '');
    setPrioridadeId(String(t.idprioridade || prioridades.find(p => normalizePriority(p.nome) === normalizePriority(t.prioridade))?.id || ''));
    setUsuarioId(String(t.usuario_id || usuario?.id || ''));
    setProjetoId(String(t.projeto_id || projetos[0]?.id || ''));
    setCep(t.endereco?.cep || t.cep || '');
    setCidade(t.endereco?.cidade || t.cidade || '');
    setUf(t.endereco?.uf || t.uf || '');
    setBairro(t.endereco?.bairro || t.bairro || '');
    setRua(t.endereco?.rua || t.rua || '');
    setModalAberto(true);
  }

  async function salvarTarefa(e) {
    e.preventDefault();
    const dados = {
      texto: titulo.trim(),
      descricao,
      idprioridade: Number(prioridadeId),
      prioridade: prioridades.find(p => String(p.id) === String(prioridadeId))?.nome || 'Média',
      coluna: normalizeColumn(colunaDestino),
      usuario_id: Number(usuarioId),
      projeto_id: Number(projetoId),
      cep: cep.replace(/\D/g, ''),
      cidade_uf: cidade && uf ? `${cidade} - ${uf}` : cidade || '',
      cidade, uf, bairro, rua,
    };

    try {
      if (tarefaEmEdicao) {
        const res = await api.put(`/tarefas/${tarefaEmEdicao.id}`, dados);
        setTarefas(current => current.map(t => Number(t.id) === Number(tarefaEmEdicao.id) ? res.data : t));
      } else {
        const res = await api.post('/tarefas', dados);
        setTarefas(current => [...current, res.data]);
      }
      setModalAberto(false);
    } catch (err) {
      alert('Erro ao salvar tarefa');
    }
  }

  async function moverTarefa(id, novaColuna) {
    const coluna = normalizeColumn(novaColuna);
    const anteriores = tarefas;
    setTarefas(anteriores.map(t => Number(t.id) === Number(id) ? { ...t, coluna, status: coluna, _movendo: true } : t));
    try {
      const response = await api.put(`/tarefas/${id}`, { coluna });
      setTarefas(current => current.map(t => Number(t.id) === Number(id) ? { ...response.data, _movendo: false } : t));
    } catch (err) {
      setTarefas(anteriores);
      const apiMessage = err.response?.data?.erro?.mensagem || err.response?.data?.erro || err.response?.data?.mensagem;
      setErro(apiMessage || 'Não foi possível mover a tarefa.');
    }
  }

  async function confirmarExclusao() {
    if (!tarefaParaExcluir) return;
    try {
      await api.delete(`/tarefas/${tarefaParaExcluir.id}`);
      setTarefas(current => current.filter(t => Number(t.id) !== Number(tarefaParaExcluir.id)));
      setTarefaParaExcluir(null);
    } catch (err) {
      alert('Erro ao excluir tarefa');
    }
  }

  // Drag and Drop
  function handleDragStart(e, id) {
    setCardArrastadoId(id);
    e.dataTransfer.setData('text/plain', String(id));
  }

  function handleDragOver(e, coluna) {
    e.preventDefault();
    if (colunaSobrevoada !== coluna) setColunaSobrevoada(coluna);
  }

  function handleDrop(e, novaColuna) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || cardArrastadoId;
    if (id) {
      moverTarefa(Number(id) || id, novaColuna);
    }
    setCardArrastadoId(null);
    setColunaSobrevoada(null);
  }

  const total = tarefas.length;
  const pendentes = tarefas.filter(t => normalizeColumn(t.coluna) !== 'concluido').length;
  const concluidas = tarefas.filter(t => normalizeColumn(t.coluna) === 'concluido').length;
  const tarefasVisiveis = useMemo(() => tarefas.filter(t => {
    const pr = normalizePriority(t.prioridade || prioridades.find(p => String(p.id) === String(t.idprioridade))?.nome || '');
    const filtroOk = filtroPrioridade === 'todas' || pr === filtroPrioridade;
    const buscaOk = !busca.trim() || `${t.titulo || t.texto || ''} ${t.descricao || ''}`.toLowerCase().includes(busca.toLowerCase());
    return filtroOk && buscaOk;
  }), [tarefas, prioridades, filtroPrioridade, busca]);

  return (
    <div className="kanban-page">
      <header className="kanban-header">
        <div>
          <h1>TaskFlow</h1>
          <p>Gerencie suas tarefas com facilidade</p>
        </div>
        <div className="contadores">
          <span className="contador-total">{total} {total === 1 ? 'tarefa' : 'tarefas'}</span>
          <span className="contador-pendente">{pendentes} pendentes</span>
          <span className="contador-concluida">{concluidas} concluídas</span>
        </div>
      </header>

      <section className="kanban-toolbar" aria-label="Pesquisa e filtros">
        <input className="kanban-search" value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar tarefas..." aria-label="Buscar tarefas" />
        <div className="kanban-priority-filters">
          <button type="button" className={filtroPrioridade === 'todas' ? 'ativo' : ''} onClick={() => setFiltroPrioridade('todas')}>Todas</button>
          {prioridades.map(p => <button type="button" key={p.id} className={filtroPrioridade === normalizePriority(p.nome) ? 'ativo' : ''} onClick={() => setFiltroPrioridade(normalizePriority(p.nome))} style={{ '--priority-color': p.cor || '#41d686' }}><i />{p.nome}</button>)}
        </div>
        <button type="button" className="btn-nova-tarefa" onClick={() => abrirNovo('afazer')}><Plus size={16} /> Nova tarefa</button>
      </section>

      {erro && <div className="erro-alerta">{erro}</div>}
      {carregando && <p className="loading-texto">Carregando quadro...</p>}

      <section className="progresso-geral" aria-label="Acompanhamento do andamento das tarefas">
        <div className="progresso-geral-topo"><div><h2>Andamento das atividades</h2><p>Atualizado conforme as tarefas do quadro</p></div><strong>{tarefasVisiveis.length} tarefas</strong></div>
        <div className="progresso-geral-barras">
          {CONFIG_COLUNAS.map(c => {
            const n = tarefasVisiveis.filter(t => normalizeColumn(t.coluna) === c.status).length;
            const pct = tarefasVisiveis.length ? Math.round(n / tarefasVisiveis.length * 100) : 0;
            return <div className={`progresso-geral-item ${c.classeCss}`} key={c.status}><div><span>{c.titulo}</span><b>{n} · {pct}%</b></div><div className="progresso-geral-trilha"><i style={{ width: `${pct}%` }} /></div></div>;
          })}
        </div>
      </section>

      {/* Grade de Colunas */}
      <div className="kanban-colunas">
        {CONFIG_COLUNAS.map((coluna) => {
          const tarefasDaColuna = tarefasVisiveis.filter(t => normalizeColumn(t.coluna) === coluna.status);
          const isOver = colunaSobrevoada === coluna.status;
          const IconeColuna = coluna.icone;
          const porcentagem = tarefasVisiveis.length > 0 
            ? Math.round((tarefasDaColuna.length / tarefasVisiveis.length) * 100) 
            : 0;

          return (
            <div
              key={coluna.status}
              className={`coluna coluna-${coluna.classeCss} ${isOver ? 'coluna-drop-hover' : ''}`}
              onDragOver={(e) => handleDragOver(e, coluna.status)}
              onDragLeave={() => setColunaSobrevoada(null)}
              onDrop={(e) => handleDrop(e, coluna.status)}
            >
              {/* Topo Enriquecido da Coluna */}
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

                {/* Barra de Progresso com porcentagem numérica ao lado */}
                <div className="coluna-progresso-container" title={`${porcentagem}% do total de tarefas`}>
                  <div className="coluna-progresso-trilha">
                    <div
                      className="coluna-progresso-barra"
                      style={{ width: `${porcentagem}%` }}
                    />
                  </div>
                  <span className="coluna-progresso-valor">{porcentagem}%</span>
                </div>
              </div>

              {/* Lista de Cards da Coluna */}
              <div className="lista-cards">
                {tarefasDaColuna.map((tarefa) => {
                  const local = tarefa.cidadeUf || (tarefa.endereco?.cidade ? `${tarefa.endereco.cidade} - ${tarefa.endereco.uf}` : '');
                  const arrastandoEste = cardArrastadoId === tarefa.id;

                  return (
                    <div
                      key={tarefa.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, tarefa.id)}
                      onDragEnd={() => {
                        setCardArrastadoId(null);
                        setColunaSobrevoada(null);
                      }}
                      className={`card-tarefa ${normalizePriority(tarefa.prioridade || prioridades.find(p => String(p.id) === String(tarefa.idprioridade))?.nome || 'media')} ${arrastandoEste ? 'arrastando' : ''} ${tarefa._movendo ? 'movendo' : ''}`}
                    >
                      <div className="card-cabecalho">
                        <div className="card-info-principal">
                          <span className="drag-handle" title="Arraste para mover de coluna">
                            <GripVertical size={14} />
                          </span>
                          <div>
                            <h4>{tarefa.titulo || tarefa.texto}</h4>
                            {tarefa.descricao && <p className="card-desc">{tarefa.descricao}</p>}
                            {local && (
                              <div className="localizacao">
                                <MapPin size={12} />
                                <span>{local}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Badge de Prioridade com a bolinha colorida */}
                        <span className={`badge-prioridade ${normalizePriority(tarefa.prioridade || prioridades.find(p => String(p.id) === String(tarefa.idprioridade))?.nome || 'media')}`}>
                          <span className="bolinha-prioridade" />
                          {tarefa.prioridade || prioridades.find(p => String(p.id) === String(tarefa.idprioridade))?.nome || 'Média'}
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

                {/* Empty State quando a coluna não tem cards */}
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

      {/* Modal de Criação / Edição com labels e ids associados */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header-box">
              <h3>{tarefaEmEdicao ? 'Editar tarefa' : 'Nova tarefa'}</h3>
              <p>Defina a prioridade, a coluna e o endereço automático pelo CEP.</p>
            </div>

            <form onSubmit={salvarTarefa}>
              <div className="form-group">
                <label htmlFor="campo-titulo">Título</label>
                <input
                  id="campo-titulo"
                  name="titulo"
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex.: Revisar relatório"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="campo-descricao">Descrição</label>
                <textarea
                  id="campo-descricao"
                  name="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Detalhes da tarefa"
                  rows={2}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="campo-prioridade">Prioridade</label>
                  <select id="campo-prioridade" name="prioridade" value={prioridadeId} onChange={e => setPrioridadeId(e.target.value)} required>
                    {prioridades.map(p => { const key = normalizePriority(p.nome); const dot = key === 'urgente' ? '🟣' : key === 'alta' ? '🔴' : key === 'media' ? '🟡' : '🟢'; return <option key={p.id} value={p.id}>{dot} {p.nome}</option>; })}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="campo-coluna">Coluna</label>
                  <select 
                    id="campo-coluna" 
                    name="coluna" 
                    value={colunaDestino} 
                    onChange={(e) => setColunaDestino(e.target.value)}
                  >
                    <option value="afazer">○ A Fazer</option>
                    <option value="andamento">◷ Em Andamento</option>
                    <option value="concluido">✓ Concluído</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group"><label htmlFor="campo-responsavel">Responsável</label>
                  <select id="campo-responsavel" value={usuarioId} onChange={e => setUsuarioId(e.target.value)} required>
                    {usuarios.map(u => <option key={u.id} value={u.id}>👤 {u.nome} · {u.email}</option>)}
                  </select>
                </div>
                <div className="form-group"><label htmlFor="campo-projeto">Projeto</label>
                  <select id="campo-projeto" value={projetoId} onChange={e => setProjetoId(e.target.value)} required>
                    {projetos.map(pr => <option key={pr.id} value={pr.id}>📁 {pr.nome}</option>)}
                  </select>
                </div>
              </div>

              {/* CEP com máscara e bloqueio de letras */}
              <div className="form-group">
                <label htmlFor="campo-cep"><MapPin size={13} /> CEP (somente números)</label>
                <input
                  id="campo-cep"
                  name="cep"
                  type="text"
                  inputMode="numeric"
                  value={cep}
                  onChange={handleCepChange}
                  placeholder="00000-000"
                  maxLength={9}
                />
                <span className="form-subtexto">
                  {buscandoCep ? 'Consultando ViaCEP...' : 'Apenas dígitos numéricos. Cidade, estado, bairro e rua são preenchidos.'}
                </span>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="campo-cidade">Cidade</label>
                  <input 
                    id="campo-cidade" 
                    name="cidade" 
                    type="text" 
                    value={cidade} 
                    onChange={(e) => setCidade(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="campo-uf">UF</label>
                  <input 
                    id="campo-uf" 
                    name="uf" 
                    type="text" 
                    value={uf} 
                    onChange={(e) => setUf(e.target.value)} 
                    maxLength={2} 
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="campo-bairro">Bairro</label>
                  <input 
                    id="campo-bairro" 
                    name="bairro" 
                    type="text" 
                    value={bairro} 
                    onChange={(e) => setBairro(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="campo-rua">Rua</label>
                  <input 
                    id="campo-rua" 
                    name="rua" 
                    type="text" 
                    value={rua} 
                    onChange={(e) => setRua(e.target.value)} 
                  />
                </div>
              </div>

              <div className="modal-acoes">
                <button type="button" onClick={() => setModalAberto(false)} className="btn-cancelar">Cancelar</button>
                <button type="submit" className="btn-salvar">
                  {tarefaEmEdicao ? 'Salvar alterações' : 'Criar tarefa'}
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
              <h3>Excluir "{tarefaParaExcluir.titulo || tarefaParaExcluir.texto}"?</h3>
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
