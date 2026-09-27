// src/pages/kanban.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
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
  CheckCircle2,
  Search,
  X,
  Sparkles,
  TrendingUp,
  Filter,
  ChevronDown
} from 'lucide-react';

const CONFIG_COLUNAS = [
  {
    status: 'A FAZER',
    titulo: 'A Fazer',
    subtitulo: 'Aguardando início',
    tag: 'Backlog',
    classeCss: 'afazer',
    cor: '#38bdf8', // Ciano minimalista
    icone: ListTodo
  },
  {
    status: 'EM ANDAMENTO',
    titulo: 'Em Andamento',
    subtitulo: 'Em execução',
    tag: 'Em foco',
    classeCss: 'andamento',
    cor: '#f6c330', // Âmbar sutil
    pulsar: true,
    icone: Clock
  },
  {
    status: 'CONCLUÍDO',
    titulo: 'Concluído',
    subtitulo: 'Finalizadas',
    tag: 'Entregue',
    classeCss: 'concluido',
    cor: '#41d686', // Verde esmeralda
    icone: CheckCircle2
  }
];

const OPCOES_PRIORIDADE = [
  { id: 'BAIXA', rotulo: 'Baixa', cor: '#41d686' },
  { id: 'MEDIA', rotulo: 'Média', cor: '#f6c330' },
  { id: 'ALTA', rotulo: 'Alta', cor: '#ff5065' }
];

const OPCOES_COLUNA = [
  { id: 'A FAZER', rotulo: 'A Fazer', cor: '#38bdf8' },
  { id: 'EM ANDAMENTO', rotulo: 'Em Andamento', cor: '#f6c330' },
  { id: 'CONCLUÍDO', rotulo: 'Concluído', cor: '#41d686' }
];

function mesmaColuna(colunaA, colunaB) {
  if (!colunaA || !colunaB) return false;
  const limpa = (str) =>
    String(str)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\s_-]+/g, '');
  return limpa(colunaA) === limpa(colunaB);
}

export default function Kanban() {
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Busca e Filtros
  const [busca, setBusca] = useState('');
  const [filtroPrioridade, setFiltroPrioridade] = useState('TODAS');

  // Celebração ao concluir tarefa
  const [celebrando, setCelebrando] = useState(false);

  // Drag and drop
  const [cardArrastadoId, setCardArrastadoId] = useState(null);
  const [colunaSobrevoada, setColunaSobrevoada] = useState(null);

  // Modais
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEmEdicao, setTarefaEmEdicao] = useState(null);
  const [tarefaParaExcluir, setTarefaParaExcluir] = useState(null);

  // Dropdowns do modal
  const [dropPrioridadeAberto, setDropPrioridadeAberto] = useState(false);
  const [dropColunaAberto, setDropColunaAberto] = useState(false);

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
      const dados = Array.isArray(resposta.data)
        ? resposta.data
        : resposta.data?.tarefas || [];
      setTarefas(dados);
    } catch (e) {
      setErro('Erro ao carregar tarefas. Verifique se a API está ligada.');
    } finally {
      setCarregando(false);
    }
  }

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

  function dispararCelebracao() {
    setCelebrando(true);
    setTimeout(() => setCelebrando(false), 2400);
  }

  function abrirNovo(coluna) {
    setTarefaEmEdicao(null);
    setColunaDestino(coluna || 'A FAZER');
    setTitulo('');
    setDescricao('');
    setPrioridade('MEDIA');
    setCep('');
    setCidade('');
    setUf('');
    setBairro('');
    setRua('');
    setDropPrioridadeAberto(false);
    setDropColunaAberto(false);
    setModalAberto(true);
  }

  function abrirEdicao(t) {
    setTarefaEmEdicao(t);
    setColunaDestino(t.coluna || 'A FAZER');
    setTitulo(t.titulo || t.texto || '');
    setDescricao(t.descricao || '');
    setPrioridade(t.prioridade?.toUpperCase() || 'MEDIA');
    setCep(t.endereco?.cep || t.cep || '');
    setCidade(t.endereco?.cidade || t.cidade || '');
    setUf(t.endereco?.uf || t.uf || '');
    setBairro(t.endereco?.bairro || t.bairro || '');
    setRua(t.endereco?.rua || t.rua || '');
    setDropPrioridadeAberto(false);
    setDropColunaAberto(false);
    setModalAberto(true);
  }

  async function salvarTarefa(e) {
    e.preventDefault();
    const dados = {
      titulo,
      texto: titulo,
      descricao,
      prioridade,
      coluna: colunaDestino,
      cidadeUf: cidade && uf ? `${cidade} - ${uf}` : cidade || '',
      endereco: { cep, cidade, uf, bairro, rua }
    };

    try {
      if (tarefaEmEdicao) {
        const res = await api.put(`/tarefas/${tarefaEmEdicao.id}`, dados);
        setTarefas((prev) =>
          prev.map((t) => (t.id === tarefaEmEdicao.id ? res.data : t))
        );
        if (mesmaColuna(colunaDestino, 'CONCLUÍDO') && !mesmaColuna(tarefaEmEdicao.coluna, 'CONCLUÍDO')) {
          dispararCelebracao();
        }
      } else {
        const res = await api.post('/tarefas', dados);
        setTarefas((prev) => [...prev, res.data]);
        if (mesmaColuna(colunaDestino, 'CONCLUÍDO')) {
          dispararCelebracao();
        }
      }
      setModalAberto(false);
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao salvar tarefa');
    }
  }

  async function moverTarefa(id, novaColuna) {
    if (mesmaColuna(novaColuna, 'CONCLUÍDO')) {
      dispararCelebracao();
    }

    try {
      setTarefas((prev) =>
        prev.map((t) => (t.id === id ? { ...t, coluna: novaColuna } : t))
      );
      const res = await api.put(`/tarefas/${id}`, { coluna: novaColuna });
      setTarefas((prev) =>
        prev.map((t) => (t.id === id ? res.data : t))
      );
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao mover tarefa');
      carregarTarefas();
    }
  }

  async function confirmarExclusao() {
    if (!tarefaParaExcluir) return;
    try {
      await api.delete(`/tarefas/${tarefaParaExcluir.id}`);
      setTarefas((prev) => prev.filter((t) => t.id !== tarefaParaExcluir.id));
      setTarefaParaExcluir(null);
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao excluir tarefa');
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

  // Métricas
  const total = tarefas.length;
  const pendentes = tarefas.filter((t) => !mesmaColuna(t.coluna, 'CONCLUÍDO')).length;
  const concluidas = tarefas.filter((t) => mesmaColuna(t.coluna, 'CONCLUÍDO')).length;
  const porcentagemGeral = total > 0 ? Math.round((concluidas / total) * 100) : 0;

  // Filtragem combinada
  const tarefasFiltradas = tarefas.filter((t) => {
    const textoBusca = busca.trim().toLowerCase();
    const tituloCard = (t.titulo || t.texto || '').toLowerCase();
    const descCard = (t.descricao || '').toLowerCase();
    const localCard = (t.cidadeUf || t.endereco?.cidade || '').toLowerCase();

    const combinaBusca = !textoBusca || tituloCard.includes(textoBusca) || descCard.includes(textoBusca) || localCard.includes(textoBusca);
    const combinaPrioridade = filtroPrioridade === 'TODAS' || (t.prioridade?.toUpperCase() === filtroPrioridade);

    return combinaBusca && combinaPrioridade;
  });

  const prioridadeAtual = OPCOES_PRIORIDADE.find(p => p.id === prioridade) || OPCOES_PRIORIDADE[1];
  const colunaAtual = OPCOES_COLUNA.find(c => mesmaColuna(c.id, colunaDestino)) || OPCOES_COLUNA[0];

  return (
    <div className="kanban-page" style={{ position: 'relative' }}>
      
      <style>{`
        @keyframes animCardArraste {
          0% { transform: scale(1) rotate(0); }
          100% { transform: scale(1.02) rotate(1.5deg); box-shadow: 0 16px 32px rgba(0,0,0,0.65); }
        }
        @keyframes popupToastSucesso {
          0% { transform: translateY(-16px) scale(0.94); opacity: 0; }
          40% { transform: translateY(3px) scale(1.01); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes barraRegressiva {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes pulsoPontoMini {
          0%, 100% { opacity: 0.9; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.25); }
        }
        .card-tarefa.arrastando {
          opacity: 0.82;
          animation: animCardArraste 0.2s forwards ease-out;
          cursor: grabbing !important;
        }
        .pill-metrica-slim {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pill-metrica-slim:hover {
          transform: translateY(-1.5px);
          background: rgba(255, 255, 255, 0.06) !important;
          border-color: rgba(255, 255, 255, 0.22) !important;
        }
        .barra-busca-input:focus {
          border-color: #41d686 !important;
          box-shadow: 0 0 12px rgba(65, 214, 134, 0.2) !important;
        }
        .item-dropdown-opcao:hover {
          background: rgba(255, 255, 255, 0.06) !important;
          transform: translateX(3px);
        }
      `}</style>

      {/* TOAST MINIMALISTA AO CONCLUIR TAREFA */}
      {celebrando && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 10000,
          background: 'rgba(15, 22, 18, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(65, 214, 134, 0.35)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(65, 214, 134, 0.15)',
          borderRadius: '10px',
          overflow: 'hidden',
          minWidth: '260px',
          animation: 'popupToastSucesso 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>
          <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '7px',
              background: 'rgba(65, 214, 134, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#41d686',
              flexShrink: 0
            }}>
              <CheckCircle2 size={17} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.86rem', color: '#ffffff' }}>
                Tarefa Concluída!
              </div>
              <div style={{ fontSize: '0.74rem', color: '#9ca3af' }}>
                Progresso atualizado no quadro.
              </div>
            </div>
          </div>
          <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.06)' }}>
            <div style={{
              height: '100%',
              backgroundColor: '#41d686',
              animation: 'barraRegressiva 2.4s linear forwards'
            }} />
          </div>
        </div>
      )}

      {/* CABEÇALHO COM CONTADORES ULTRA-SLIM */}
      <header className="kanban-header" style={{ marginBottom: '0.9rem', alignItems: 'center' }}>
        <div>
          <h1 style={{ letterSpacing: '-0.02em', fontSize: '1.65rem' }}>TaskFlow</h1>
          <p style={{ color: '#8e8ea0', fontSize: '0.84rem' }}>Gerencie suas tarefas com facilidade</p>
        </div>

        {/* Pílulas de Contadores Finas e Interativas */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          
          {/* Pílula: Total */}
          <div 
            className="pill-metrica-slim"
            title="Total de tarefas cadastradas"
            style={{
              background: '#12121b',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              borderRadius: '24px',
              padding: '0.32rem 0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: 'default'
            }}
          >
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#9ca3af'
            }} />
            <span style={{ fontSize: '0.76rem', color: '#8e8ea0', fontWeight: 500 }}>Total</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>{total}</span>
          </div>

          {/* Pílula: Pendentes */}
          <div 
            className="pill-metrica-slim"
            title="Tarefas aguardando conclusão"
            style={{
              background: '#12121b',
              border: '1px solid rgba(246, 195, 48, 0.22)',
              borderRadius: '24px',
              padding: '0.32rem 0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: 'default'
            }}
          >
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#f6c330',
              animation: 'pulsoPontoMini 2s infinite ease-in-out'
            }} />
            <span style={{ fontSize: '0.76rem', color: '#f6c330', fontWeight: 500 }}>Pendentes</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>{pendentes}</span>
          </div>

          {/* Pílula: Concluídas */}
          <div 
            className="pill-metrica-slim"
            title="Tarefas concluídas com sucesso"
            style={{
              background: '#12121b',
              border: '1px solid rgba(65, 214, 134, 0.25)',
              borderRadius: '24px',
              padding: '0.32rem 0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: 'default'
            }}
          >
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#41d686',
              boxShadow: '0 0 6px rgba(65, 214, 134, 0.6)'
            }} />
            <span style={{ fontSize: '0.76rem', color: '#41d686', fontWeight: 500 }}>Concluídas</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>{concluidas}</span>
          </div>

        </div>
      </header>

      {/* SPRINT PROGRESS: LINHA ULTRA-FINA */}
      <div style={{
        background: '#111118',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '7px',
        padding: '0.55rem 0.85rem',
        marginBottom: '1.15rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
          <TrendingUp size={13} color="#41d686" />
          <span style={{ color: '#9ca3af', fontSize: '0.78rem' }}>
            Sprint: <strong style={{ color: '#ffffff' }}>{porcentagemGeral}%</strong>
          </span>
        </div>

        {/* Trilha Slim de 3px */}
        <div style={{ flex: 1, height: '3px', background: '#1c1c28', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            width: `${porcentagemGeral}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #38bdf8 0%, #f6c330 50%, #41d686 100%)',
            borderRadius: '4px',
            transition: 'width 0.4s ease'
          }} />
        </div>

        <span style={{ color: '#71717a', fontSize: '0.72rem', flexShrink: 0 }}>
          {concluidas}/{total} entregues
        </span>
      </div>

      {/* BUSCA E FILTROS COMPACTOS NO TOPO */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        marginBottom: '1.25rem'
      }}>
        {/* Barra de Busca */}
        <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '340px' }}>
          <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
          <input
            type="text"
            className="barra-busca-input"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar tarefas..."
            style={{
              width: '100%',
              background: '#12121a',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '7px',
              padding: '0.5rem 2rem 0.5rem 2rem',
              color: '#ffffff',
              fontSize: '0.82rem',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
          />
          {busca && (
            <button
              onClick={() => setBusca('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#8e8ea0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Chips de Prioridade Slim */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          <span style={{ color: '#71717a', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginRight: '0.15rem' }}>
            <Filter size={12} />
            Prioridade:
          </span>

          {[
            { id: 'TODAS', rotulo: 'Todas', cor: '#9ca3af' },
            { id: 'ALTA', rotulo: 'Alta', cor: '#ff5065' },
            { id: 'MEDIA', rotulo: 'Média', cor: '#f6c330' },
            { id: 'BAIXA', rotulo: 'Baixa', cor: '#41d686' }
          ].map((chip) => {
            const ativo = filtroPrioridade === chip.id;
            const contagem = chip.id === 'TODAS' 
              ? tarefas.length 
              : tarefas.filter(t => t.prioridade?.toUpperCase() === chip.id).length;

            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setFiltroPrioridade(chip.id)}
                style={{
                  background: ativo ? '#1b1b26' : '#121218',
                  border: ativo ? `1px solid ${chip.cor}` : '1px solid rgba(255, 255, 255, 0.06)',
                  color: ativo ? '#ffffff' : '#8e8ea0',
                  borderRadius: '14px',
                  padding: '0.28rem 0.65rem',
                  fontSize: '0.74rem',
                  fontWeight: ativo ? 600 : 400,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.15s ease'
                }}
              >
                {chip.id !== 'TODAS' && (
                  <span style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: chip.cor
                  }} />
                )}
                <span>{chip.rotulo}</span>
                <span style={{
                  fontSize: '0.68rem',
                  opacity: 0.65,
                  background: 'rgba(255,255,255,0.06)',
                  padding: '0.05rem 0.28rem',
                  borderRadius: '6px'
                }}>
                  {contagem}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {erro && <div className="erro-alerta">{erro}</div>}
      {carregando && <p className="loading-texto">Carregando quadro...</p>}

      {/* COLUNAS COM DESIGN ULTRA-MINIMALISTA */}
      <div className="kanban-colunas">
        {CONFIG_COLUNAS.map((coluna) => {
          const tarefasDaColuna = tarefasFiltradas.filter((t) =>
            mesmaColuna(t.coluna, coluna.status)
          );
          const isOver = colunaSobrevoada === coluna.status;
          const IconeColuna = coluna.icone;
          const porcentagem =
            total > 0
              ? Math.round((tarefasDaColuna.length / total) * 100)
              : 0;

          return (
            <div
              key={coluna.status}
              className={`coluna coluna-${coluna.classeCss} ${
                isOver ? 'coluna-drop-hover' : ''
              }`}
              style={{
                borderTop: `1.5px solid ${coluna.cor}88`, // Filete ultra-fino
                boxShadow: isOver ? `0 0 20px ${coluna.cor}22` : 'none'
              }}
              onDragOver={(e) => handleDragOver(e, coluna.status)}
              onDragLeave={() => setColunaSobrevoada(null)}
              onDrop={(e) => handleDrop(e, coluna.status)}
            >
              {/* Topo Enriquecido da Coluna */}
              <div className="coluna-cabecalho-detalhado">
                <div className="coluna-linha-principal">
                  <div className="coluna-info-grupo">
                    <div 
                      className="coluna-icone-caixa"
                      style={{
                        color: coluna.cor,
                        background: `${coluna.cor}10`,
                        border: `1px solid ${coluna.cor}25`
                      }}
                    >
                      <IconeColuna size={16} />
                    </div>
                    <div className="coluna-titulos-box">
                      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.98rem' }}>
                        {/* Ponto luminoso sutil */}
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: coluna.cor
                        }} />
                        <span>{coluna.titulo}</span>
                        <span className="badge-count" style={{ fontSize: '0.72rem' }}>
                          {tarefasDaColuna.length}
                        </span>
                      </h3>
                      <span className="coluna-subtitulo" style={{ fontSize: '0.74rem' }}>
                        {coluna.subtitulo}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span 
                      className={`coluna-badge-status ${coluna.classeCss}`}
                      style={{
                        borderColor: `${coluna.cor}30`,
                        color: coluna.cor,
                        fontSize: '0.7rem',
                        padding: '0.15rem 0.45rem'
                      }}
                    >
                      {coluna.pulsar && (
                        <span 
                          className="ponto-pulso"
                          style={{ backgroundColor: coluna.cor, width: '4px', height: '4px' }}
                        />
                      )}
                      {coluna.tag}
                    </span>

                    <button 
                      onClick={() => abrirNovo(coluna.status)} 
                      className="btn-add-mini" 
                      title={`Adicionar em ${coluna.titulo}`}
                      type="button"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Linha de Progresso Fina da Coluna */}
                <div
                  className="coluna-progresso-container"
                  title={`${porcentagem}% do total de tarefas`}
                  style={{ marginTop: '0.5rem' }}
                >
                  <div className="coluna-progresso-trilha" style={{ height: '2px' }}>
                    <div
                      className="coluna-progresso-barra"
                      style={{ 
                        width: `${porcentagem}%`,
                        backgroundColor: coluna.cor 
                      }}
                    />
                  </div>
                  <span className="coluna-progresso-valor" style={{ fontSize: '0.7rem' }}>{porcentagem}%</span>
                </div>
              </div>

              {/* Lista de Cards */}
              <div className="lista-cards">
                {tarefasDaColuna.map((tarefa) => {
                  const local =
                    tarefa.cidadeUf ||
                    (tarefa.endereco?.cidade
                      ? `${tarefa.endereco.cidade} - ${tarefa.endereco.uf}`
                      : '');
                  const arrastandoEste = cardArrastadoId === tarefa.id;
                  const tituloExibido = tarefa.titulo || tarefa.texto || 'Sem título';

                  return (
                    <div
                      key={tarefa.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, tarefa.id)}
                      onDragEnd={() => {
                        setCardArrastadoId(null);
                        setColunaSobrevoada(null);
                      }}
                      className={`card-tarefa ${
                        tarefa.prioridade?.toLowerCase() || 'media'
                      } ${arrastandoEste ? 'arrastando' : ''}`}
                    >
                      <div className="card-cabecalho">
                        <div className="card-info-principal">
                          <span
                            className="drag-handle"
                            title="Arraste para mover de coluna"
                          >
                            <GripVertical size={14} />
                          </span>
                          <div>
                            <h4>{tituloExibido}</h4>
                            {tarefa.descricao && (
                              <p className="card-desc">{tarefa.descricao}</p>
                            )}
                            {local && (
                              <div className="localizacao">
                                <MapPin size={12} />
                                <span>{local}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Badge de Prioridade com bolinha colorida */}
                        <span
                          className={`badge-prioridade ${
                            tarefa.prioridade?.toLowerCase() || 'media'
                          }`}
                        >
                          <span className="bolinha-prioridade" />
                          {tarefa.prioridade || 'MÉDIA'}
                        </span>
                      </div>

                      <div className="card-rodape">
                        <div className="acoes-card">
                          {mesmaColuna(coluna.status, 'EM ANDAMENTO') && (
                            <button
                              onClick={() => moverTarefa(tarefa.id, 'A FAZER')}
                              title="Voltar para A Fazer"
                            >
                              <ArrowLeft size={14} />
                            </button>
                          )}
                          {mesmaColuna(coluna.status, 'CONCLUÍDO') && (
                            <button
                              onClick={() =>
                                moverTarefa(tarefa.id, 'EM ANDAMENTO')
                              }
                              title="Voltar para Em Andamento"
                            >
                              <ArrowLeft size={14} />
                            </button>
                          )}
                          {mesmaColuna(coluna.status, 'A FAZER') && (
                            <button
                              onClick={() =>
                                moverTarefa(tarefa.id, 'EM ANDAMENTO')
                              }
                              title="Avançar para Em Andamento"
                            >
                              <ArrowRight size={14} />
                            </button>
                          )}
                          {mesmaColuna(coluna.status, 'EM ANDAMENTO') && (
                            <button
                              onClick={() =>
                                moverTarefa(tarefa.id, 'CONCLUÍDO')
                              }
                              title="Concluir tarefa"
                            >
                              <ArrowRight size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => abrirEdicao(tarefa)}
                            title="Editar"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => setTarefaParaExcluir(tarefa)}
                            className="btn-excluir"
                            title="Excluir"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {tarefasDaColuna.length === 0 && (
                  <div className="coluna-vazia">
                    <IconeColuna size={22} style={{ opacity: 0.25, color: coluna.cor }} />
                    <p style={{ fontSize: '0.82rem' }}>Nenhuma tarefa em {coluna.titulo.toLowerCase()}</p>
                    <span style={{ fontSize: '0.74rem' }}>Arraste um card ou clique no + acima</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DE CRIAÇÃO / EDIÇÃO */}
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

              {/* DROPDOWNS CUSTOMIZADOS */}
              <div className="form-grid-2">
                
                {/* Dropdown de Prioridade */}
                <div className="form-group" style={{ position: 'relative' }}>
                  <label>Prioridade</label>
                  <button
                    type="button"
                    onClick={() => {
                      setDropPrioridadeAberto(!dropPrioridadeAberto);
                      setDropColunaAberto(false);
                    }}
                    style={{
                      width: '100%',
                      background: '#13131e',
                      border: dropPrioridadeAberto ? '1px solid #41d686' : '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '0.86rem',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      boxShadow: dropPrioridadeAberto ? '0 0 10px rgba(65, 214, 134, 0.2)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: prioridadeAtual.cor,
                        boxShadow: `0 0 6px ${prioridadeAtual.cor}`
                      }} />
                      <span>{prioridadeAtual.rotulo}</span>
                    </div>
                    <ChevronDown 
                      size={15} 
                      color="#8e8ea0" 
                      style={{ 
                        transform: dropPrioridadeAberto ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.2s ease' 
                      }} 
                    />
                  </button>

                  {dropPrioridadeAberto && (
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 4px)',
                      left: 0,
                      width: '100%',
                      background: '#161622',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '0.35rem',
                      zIndex: 1000,
                      boxShadow: '0 12px 28px rgba(0, 0, 0, 0.7)'
                    }}>
                      {OPCOES_PRIORIDADE.map((p) => {
                        const selecionada = prioridade === p.id;
                        return (
                          <div
                            key={p.id}
                            className="item-dropdown-opcao"
                            onClick={() => {
                              setPrioridade(p.id);
                              setDropPrioridadeAberto(false);
                            }}
                            style={{
                              padding: '0.58rem 0.75rem',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              background: selecionada ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                backgroundColor: p.cor,
                                boxShadow: `0 0 5px ${p.cor}`
                              }} />
                              <span style={{ color: selecionada ? '#ffffff' : '#9ca3af', fontSize: '0.84rem', fontWeight: selecionada ? 600 : 400 }}>
                                {p.rotulo}
                              </span>
                            </div>
                            {selecionada && <span style={{ color: '#41d686', fontSize: '0.8rem' }}>✓</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Dropdown de Coluna */}
                <div className="form-group" style={{ position: 'relative' }}>
                  <label>Coluna Destino</label>
                  <button
                    type="button"
                    onClick={() => {
                      setDropColunaAberto(!dropColunaAberto);
                      setDropPrioridadeAberto(false);
                    }}
                    style={{
                      width: '100%',
                      background: '#13131e',
                      border: dropColunaAberto ? '1px solid #41d686' : '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '0.86rem',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      boxShadow: dropColunaAberto ? '0 0 10px rgba(65, 214, 134, 0.2)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: colunaAtual.cor,
                        boxShadow: `0 0 6px ${colunaAtual.cor}`
                      }} />
                      <span>{colunaAtual.rotulo}</span>
                    </div>
                    <ChevronDown 
                      size={15} 
                      color="#8e8ea0" 
                      style={{ 
                        transform: dropColunaAberto ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.2s ease' 
                      }} 
                    />
                  </button>

                  {dropColunaAberto && (
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 4px)',
                      left: 0,
                      width: '100%',
                      background: '#161622',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '0.35rem',
                      zIndex: 1000,
                      boxShadow: '0 12px 28px rgba(0, 0, 0, 0.7)'
                    }}>
                      {OPCOES_COLUNA.map((col) => {
                        const selecionada = mesmaColuna(colunaDestino, col.id);
                        return (
                          <div
                            key={col.id}
                            className="item-dropdown-opcao"
                            onClick={() => {
                              setColunaDestino(col.id);
                              setDropColunaAberto(false);
                            }}
                            style={{
                              padding: '0.58rem 0.75rem',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              background: selecionada ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                backgroundColor: col.cor,
                                boxShadow: `0 0 5px ${col.cor}`
                              }} />
                              <span style={{ color: selecionada ? '#ffffff' : '#9ca3af', fontSize: '0.84rem', fontWeight: selecionada ? 600 : 400 }}>
                                {col.rotulo}
                              </span>
                            </div>
                            {selecionada && <span style={{ color: '#41d686', fontSize: '0.8rem' }}>✓</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>

              {/* CEP */}
              <div className="form-group" style={{ marginTop: '0.8rem' }}>
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
                  {buscandoCep ? 'Consultando ViaCEP...' : 'Apenas dígitos numéricos. Endereço preenchido automaticamente.'}
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
                <button type="button" onClick={() => setModalAberto(false)} className="btn-cancelar">
                  Cancelar
                </button>
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
              <button onClick={() => setTarefaParaExcluir(null)} className="btn-cancelar">
                Cancelar
              </button>
              <button onClick={confirmarExclusao} className="btn-confirmar-exclusao">
                Excluir tarefa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
