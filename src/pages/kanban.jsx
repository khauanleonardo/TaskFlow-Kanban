import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, ArrowLeft, ArrowRight, Trash2, Pencil, MapPin, GripVertical } from 'lucide-react';

export default function Kanban() {
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
  const [prioridade, setPrioridade] = useState('MEDIA');
  const [colunaDestino, setColunaDestino] = useState('A FAZER');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [bairro, setBairro] = useState('');
  const [rua, setRua] = useState('');
  const [buscandoCep, setBuscandoCep] = useState(false);

  useEffect(() => {
    carregarTarefas();
  }, []);

  async function carregarTarefas() {
    try {
      setCarregando(true);
      setErro('');
      const resposta = await api.get('/tarefas');
      setTarefas(resposta.data);
    } catch (e) {
      setErro('Erro ao carregar tarefas. Verifique se a API está ligada.');
    } finally {
      setCarregando(false);
    }
  }

  // Permite APENAS números de 0 a 9 e insere o hífen automaticamente
  function handleCepChange(e) {
    const apenasNumeros = e.target.value.replace(/\D/g, ''); // Remove letras e símbolos
    if (apenasNumeros.length > 8) return;

    // Máscara 00000-000
    let formatado = apenasNumeros;
    if (apenasNumeros.length > 5) {
      formatado = `${apenasNumeros.slice(0, 5)}-${apenasNumeros.slice(5)}`;
    }
    setCep(formatado);

    // Consulta automática ao atingir 8 dígitos
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
    setPrioridade('MEDIA');
    setCep('');
    setCidade('');
    setUf('');
    setBairro('');
    setRua('');
    setModalAberto(true);
  }

  function abrirEdicao(t) {
    setTarefaEmEdicao(t);
    setColunaDestino(t.coluna || 'A FAZER');
    setTitulo(t.titulo || '');
    setDescricao(t.descricao || '');
    setPrioridade(t.prioridade || 'MEDIA');
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
      titulo,
      descricao,
      prioridade,
      coluna: colunaDestino,
      cidadeUf: cidade && uf ? `${cidade} - ${uf}` : cidade || '',
      endereco: { cep, cidade, uf, bairro, rua }
    };

    try {
      if (tarefaEmEdicao) {
        const res = await api.put(`/tarefas/${tarefaEmEdicao.id}`, dados);
        setTarefas(tarefas.map(t => t.id === tarefaEmEdicao.id ? res.data : t));
      } else {
        const res = await api.post('/tarefas', dados);
        setTarefas([...tarefas, res.data]);
      }
      setModalAberto(false);
    } catch (err) {
      alert('Erro ao salvar tarefa');
    }
  }

  async function moverTarefa(id, novaColuna) {
    try {
      setTarefas(tarefas.map(t => t.id === id ? { ...t, coluna: novaColuna } : t));
      await api.put(`/tarefas/${id}`, { coluna: novaColuna });
    } catch (err) {
      alert('Erro ao mover tarefa');
      carregarTarefas();
    }
  }

  async function confirmarExclusao() {
    if (!tarefaParaExcluir) return;
    try {
      await api.delete(`/tarefas/${tarefaParaExcluir.id}`);
      setTarefas(tarefas.filter(t => t.id !== tarefaParaExcluir.id));
      setTarefaParaExcluir(null);
    } catch (err) {
      alert('Erro ao excluir tarefa');
    }
  }

  // Drag and Drop
  function handleDragStart(e, id) {
    setCardArrastadoId(id);
    e.dataTransfer.setData('text/plain', id);
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
  const pendentes = tarefas.filter(t => t.coluna !== 'CONCLUÍDO').length;
  const concluidas = tarefas.filter(t => t.coluna === 'CONCLUÍDO').length;
  const colunas = ['A FAZER', 'EM ANDAMENTO', 'CONCLUÍDO'];

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

      {erro && <div className="erro-alerta">{erro}</div>}
      {carregando && <p className="loading-texto">Carregando quadro...</p>}

      <div className="kanban-colunas">
        {colunas.map((coluna) => {
          const tarefasDaColuna = tarefas.filter(t => t.coluna === coluna);
          const isOver = colunaSobrevoada === coluna;

          return (
            <div
              key={coluna}
              className={`coluna ${isOver ? 'coluna-drop-hover' : ''}`}
              onDragOver={(e) => handleDragOver(e, coluna)}
              onDragLeave={() => setColunaSobrevoada(null)}
              onDrop={(e) => handleDrop(e, coluna)}
            >
              <div className="coluna-topo">
                <div className="coluna-titulo">
                  <h3>{coluna}</h3>
                  <span className="badge-count">{tarefasDaColuna.length}</span>
                </div>
                <button onClick={() => abrirNovo(coluna)} className="btn-add-mini" title={`Adicionar em ${coluna}`}>
                  <Plus size={15} />
                </button>
              </div>

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
                      className={`card-tarefa ${tarefa.prioridade?.toLowerCase() || 'media'} ${arrastandoEste ? 'arrastando' : ''}`}
                    >
                      <div className="card-cabecalho">
                        <div className="card-info-principal">
                          <span className="drag-handle" title="Arraste para mover de coluna">
                            <GripVertical size={14} />
                          </span>
                          <div>
                            <h4>{tarefa.titulo}</h4>
                            {tarefa.descricao && <p className="card-desc">{tarefa.descricao}</p>}
                            {local && (
                              <div className="localizacao">
                                <MapPin size={12} />
                                <span>{local}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <span className={`badge-prioridade ${tarefa.prioridade?.toLowerCase() || 'media'}`}>
                          {tarefa.prioridade}
                        </span>
                      </div>

                      <div className="card-rodape">
                        <div className="acoes-card">
                          {coluna === 'EM ANDAMENTO' && (
                            <button onClick={() => moverTarefa(tarefa.id, 'A FAZER')} title="Voltar para A Fazer">
                              <ArrowLeft size={14} />
                            </button>
                          )}
                          {coluna === 'CONCLUÍDO' && (
                            <button onClick={() => moverTarefa(tarefa.id, 'EM ANDAMENTO')} title="Voltar para Em Andamento">
                              <ArrowLeft size={14} />
                            </button>
                          )}
                          {coluna === 'A FAZER' && (
                            <button onClick={() => moverTarefa(tarefa.id, 'EM ANDAMENTO')} title="Avançar para Em Andamento">
                              <ArrowRight size={14} />
                            </button>
                          )}
                          {coluna === 'EM ANDAMENTO' && (
                            <button onClick={() => moverTarefa(tarefa.id, 'CONCLUÍDO')} title="Concluir tarefa">
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
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Criação / Edição */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header-box">
              <h3>{tarefaEmEdicao ? 'Editar tarefa' : 'Nova tarefa'}</h3>
              <p>Defina a prioridade, a coluna e o endereço automático pelo CEP.</p>
            </div>

            <form onSubmit={salvarTarefa}>
              <div className="form-group">
                <label>Título</label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex.: Revisar relatório"
                  required
                />
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Detalhes da tarefa"
                  rows={2}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Prioridade</label>
                  <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
                    <option value="BAIXA">🟢 Baixa</option>
                    <option value="MEDIA">🟡 Média</option>
                    <option value="ALTA">🔴 Alta</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Coluna</label>
                  <select value={colunaDestino} onChange={(e) => setColunaDestino(e.target.value)}>
                    <option value="A FAZER">A Fazer</option>
                    <option value="EM ANDAMENTO">Em Andamento</option>
                    <option value="CONCLUÍDO">Concluído</option>
                  </select>
                </div>
              </div>

              {/* CEP COM BLOQUEIO DE LETRAS */}
              <div className="form-group">
                <label><MapPin size={13} /> CEP (somente números)</label>
                <input
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
                  <label>Cidade</label>
                  <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>UF</label>
                  <input type="text" value={uf} onChange={(e) => setUf(e.target.value)} maxLength={2} />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Bairro</label>
                  <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Rua</label>
                  <input type="text" value={rua} onChange={(e) => setRua(e.target.value)} />
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
              <h3>Excluir "{tarefaParaExcluir.titulo}"?</h3>
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
