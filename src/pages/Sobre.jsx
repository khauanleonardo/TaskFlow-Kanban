import React, { useState } from 'react';
import { 
  Sparkles,
  Server,
  ShieldCheck,
  Code2,
  Layers,
  Copy,
  Check,
  PlusCircle,
  MapPin,
  MoveRight,
  Filter,
  PanelLeftClose,
  PanelLeftOpen,
  CheckCircle2,
  ListTodo,
  Clock,
  ArrowRight,
  MousePointer,
  HelpCircle,
  Play
} from 'lucide-react';

export default function Sobre() {
  const [copiado, setCopiado] = useState(false);
  const [etapaAtiva, setEtapaAtiva] = useState(1);

  // Estados dos simuladores interativos
  // 1. Criar
  const [tituloTarefa, setTituloTarefa] = useState('Revisar entrega final UC12');
  const [prioridadeEscolhida, setPrioridadeEscolhida] = useState('Alta');
  const [tarefaSalva, setTarefaSalva] = useState(false);

  // 2. ViaCEP
  const [cepDigitado, setCepDigitado] = useState('59015000');
  const [dadosCep, setDadosCep] = useState({ rua: 'Av. Senador Salgado Filho', bairro: 'Lagoa Nova', cidade: 'Natal', uf: 'RN' });
  const [buscandoCep, setBuscandoCep] = useState(false);

  // 3. Mover Colunas
  const [colunaAtual, setColunaAtual] = useState('EM ANDAMENTO');

  // 4. Filtro de Prioridades
  const [filtroPrioridade, setFiltroPrioridade] = useState('TODAS');

  // 5. Sidebar
  const [sidebarAberta, setSidebarAberta] = useState(true);

  const arvoreEstrutura = `taskflow-api/                           TaskFlow-Kanban/
├── src/                                ├── src/
│   ├── controllers/                    │   ├── componentes/
│   │   ├── auth.controller.js          │   │   ├── RotaPrivada.jsx
│   │   ├── projetos.controller.js      │   │   └── Sidebar.jsx
│   │   ├── tarefas.controller.js       │   ├── contexts/
│   │   └── usuarios.controller.js      │   │   └── AuthContext.jsx
│   ├── middlewares/                    │   ├── pages/
│   │   ├── autenticar.js (JWT)         │   │   ├── kanban.jsx
│   │   ├── logger.js                   │   │   ├── Login.jsx
│   │   ├── schemas.js                  │   │   └── Sobre.jsx
│   │   ├── temporizador.js             │   ├── api.js (Axios + Interceptor)
│   │   ├── validar.js                  │   ├── App.jsx
│   │   └── validarContentType.js       │   ├── main.jsx
│   ├── models/                         │   └── styles.css (Dark Obsidian)
│   │   ├── projeto.model.js            ├── index.html
│   │   ├── tarefa.model.js             ├── package.json
│   │   └── usuario.model.js            ├── .env
│   └── routes/                         ├── .env.example
│       ├── auth.routes.js              └── vercel.json
│       ├── projetos.routes.js
│       ├── tarefas.routes.js
│       └── usuarios.routes.js
├── .env
├── package.json
├── server.js (89 linhas)
└── vercel.json`;

  const estiloTexto = {
    textAlign: 'justify',
    textAlignLast: 'left',
    textJustify: 'inter-word',
    hyphens: 'auto',
    WebkitHyphens: 'auto',
    lineHeight: 1.6,
    color: '#a0a0b2'
  };

  function copiarArvore() {
    navigator.clipboard.writeText(arvoreEstrutura);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  }

  async function consultarCep(cepValor) {
    const limpo = (cepValor || cepDigitado).replace(/\D/g, '');
    if (limpo.length !== 8) return;
    setBuscandoCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
      const dados = await res.json();
      if (!dados.erro) {
        setDadosCep({
          rua: dados.logradouro || 'Sem logradouro',
          bairro: dados.bairro || 'Centro',
          cidade: dados.localidade || 'São Paulo',
          uf: dados.uf || 'SP'
        });
      }
    } catch {
      // Retorno resiliente
    } finally {
      setBuscandoCep(false);
    }
  }

  const etapasInfo = [
    { id: 1, rotulo: '1. Criar Tarefas', icone: PlusCircle },
    { id: 2, rotulo: '2. Automação CEP', icone: MapPin },
    { id: 3, rotulo: '3. Mover no Quadro', icone: MoveRight },
    { id: 4, rotulo: '4. Níveis & Filtros', icone: Filter },
    { id: 5, rotulo: '5. Sidebar Retrátil', icone: PanelLeftOpen }
  ];

  return (
    <div className="sobre-container" style={{ margin: '0 auto', maxWidth: '1080px', width: '100%', padding: '1rem 0 3.5rem 0' }}>
      
      {/* Estilos e Animações Embutidos */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(65, 214, 134, 0.2); }
          50% { box-shadow: 0 0 16px 2px rgba(65, 214, 134, 0.35); }
        }
        .anim-slide-up {
          animation: fadeSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .card-interativo {
          transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
        }
        .card-interativo:hover {
          border-color: rgba(65, 214, 134, 0.35) !important;
          transform: translateY(-2px);
        }
        .btn-etapa-tab {
          transition: all 0.25s ease;
        }
        .btn-etapa-tab:hover {
          transform: translateY(-1px);
        }
      `}</style>

      {/* Topo Principal */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div 
          className="sobre-badge" 
          style={{ 
            margin: '0 auto 1.1rem auto', 
            display: 'inline-flex',
            animation: 'pulseGlow 3s infinite ease-in-out'
          }}
        >
          <Sparkles size={14} />
          <span>TaskFlow Kanban Pro • Guia Oficial de Uso</span>
        </div>

        <h1 className="sobre-titulo-principal" style={{ textAlign: 'center', marginBottom: '0.8rem' }}>
          Manual Interativo do Sistema
        </h1>
        <p className="sobre-subtitulo" style={{ ...estiloTexto, margin: '0 auto', maxWidth: '820px' }}>
          Aprenda a operar o TaskFlow Kanban através do simulador dinâmico abaixo. 
          Alterne entre as etapas para ver o passo a passo operacional e experimentar as funcionalidades em tempo real.
        </p>
      </div>

      {/* GUIA INTERATIVO ORGANIZADO */}
      <section style={{ marginBottom: '3.5rem' }}>
        
        {/* Barra de Progresso com Abas */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '0.6rem', 
          marginBottom: '1.2rem' 
        }}>
          {etapasInfo.map(etapa => {
            const Icone = etapa.icone;
            const ativa = etapaAtiva === etapa.id;
            return (
              <button
                key={etapa.id}
                onClick={() => setEtapaAtiva(etapa.id)}
                className="btn-etapa-tab"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 0.9rem',
                  borderRadius: '8px',
                  border: ativa ? '1px solid #41d686' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: ativa ? 'rgba(65, 214, 134, 0.14)' : '#14141e',
                  color: ativa ? '#41d686' : '#9ca3af',
                  fontWeight: ativa ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: ativa ? '0 0 16px rgba(65, 214, 134, 0.15)' : 'none'
                }}
              >
                <Icone size={16} />
                <span>{etapa.rotulo}</span>
              </button>
            );
          })}
        </div>

        {/* Palco do Simulador (Layout em 2 Colunas: Instrução + Ação) */}
        <div 
          className="anim-slide-up"
          key={etapaAtiva}
          style={{
            background: '#12121a',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            borderRadius: '12px',
            padding: '1.8rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
          }}
        >
          
          {/* ETAPA 1: CRIAR TAREFA */}
          {etapaAtiva === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.8rem', alignItems: 'center' }}>
              <div>
                <span style={{ color: '#41d686', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Etapa 01 • Cadastro Ágil
                </span>
                <h3 style={{ color: '#fff', fontSize: '1.25rem', margin: '0.3rem 0 0.8rem 0' }}>Como Criar uma Nova Tarefa</h3>
                <p style={estiloTexto}>
                  No cabeçalho de qualquer coluna do Kanban, clique no botão <strong>+</strong>. Um modal interativo será exibido na tela para você cadastrar as informações principais da atividade.
                </p>
                <ul style={{ ...estiloTexto, paddingLeft: '1.2rem', margin: '0.8rem 0 0 0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <li><strong>Título objetivo:</strong> Identifica a tarefa de forma clara.</li>
                  <li><strong>Nível de prioridade:</strong> Define o destaque visual do cartão.</li>
                  <li><strong>Coluna de destino:</strong> Escolhe onde a tarefa iniciará.</li>
                </ul>
              </div>

              {/* Simulador Prático */}
              <div style={{ background: '#0d0d14', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#41d686', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.8rem' }}>
                  <Play size={13} fill="#41d686" /> Teste criar agora:
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    value={tituloTarefa}
                    onChange={(e) => setTituloTarefa(e.target.value)}
                    placeholder="Digite o título da tarefa..."
                    style={{ background: '#171722', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '0.55rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {['Alta', 'Média', 'Baixa'].map(p => (
                      <button
                        key={p}
                        onClick={() => setPrioridadeEscolhida(p)}
                        style={{
                          flex: 1,
                          padding: '0.45rem',
                          borderRadius: '6px',
                          border: `1px solid ${prioridadeEscolhida === p ? (p === 'Alta' ? '#ff5065' : p === 'Média' ? '#f6c330' : '#41d686') : 'rgba(255,255,255,0.08)'}`,
                          background: prioridadeEscolhida === p ? 'rgba(255,255,255,0.08)' : '#151520',
                          color: p === 'Alta' ? '#ff5065' : p === 'Média' ? '#f6c330' : '#41d686',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          cursor: 'pointer'
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setTarefaSalva(true)}
                    style={{ background: '#41d686', color: '#0d0d12', border: 'none', padding: '0.6rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Salvar Cartão
                  </button>
                </div>

                {/* Preview do Cartão Criado */}
                <div style={{ background: '#161622', borderLeft: `4px solid ${prioridadeEscolhida === 'Alta' ? '#ff5065' : prioridadeEscolhida === 'Média' ? '#f6c330' : '#41d686'}`, padding: '0.85rem', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: prioridadeEscolhida === 'Alta' ? '#ff5065' : prioridadeEscolhida === 'Média' ? '#f6c330' : '#41d686' }}>
                      PRIORIDADE {prioridadeEscolhida.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#41d686' }}>{tarefaSalva ? '✓ Salvo com sucesso' : 'Pré-visualização'}</span>
                  </div>
                  <strong style={{ color: '#fff', fontSize: '0.9rem', display: 'block' }}>{tituloTarefa || 'Atividade sem título'}</strong>
                  <span style={{ color: '#71717a', fontSize: '0.72rem' }}>Coluna: A FAZER</span>
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 2: AUTOMAÇÃO VIA CEP */}
          {etapaAtiva === 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.8rem', alignItems: 'center' }}>
              <div>
                <span style={{ color: '#41d686', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Etapa 02 • Integração Web
                </span>
                <h3 style={{ color: '#fff', fontSize: '1.25rem', margin: '0.3rem 0 0.8rem 0' }}>Preenchimento Automático via CEP</h3>
                <p style={estiloTexto}>
                  Para tarefas que necessitam de localização (como manutenções e visitas de campo), você não precisa preencher cada campo de endereço manualmente.
                </p>
                <p style={{ ...estiloTexto, marginTop: '0.6rem' }}>
                  Basta digitar os <strong>8 números do CEP</strong>: o TaskFlow consome a API do ViaCEP via requisição HTTP assíncrona e preenche a Rua, Bairro, Cidade e Estado imediatamente.
                </p>
              </div>

              {/* Simulador CEP */}
              <div style={{ background: '#0d0d14', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#41d686', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.8rem' }}>
                  <Play size={13} fill="#41d686" /> Digite e faça a busca ao vivo:
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem' }}>
                  <input
                    type="text"
                    maxLength={8}
                    value={cepDigitado}
                    onChange={(e) => setCepDigitado(e.target.value)}
                    placeholder="Ex: 59015000"
                    style={{ background: '#171722', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '0.55rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', width: '140px' }}
                  />
                  <button
                    onClick={() => consultarCep()}
                    disabled={buscandoCep}
                    style={{ background: '#41d686', color: '#0d0d12', border: 'none', padding: '0.55rem 1rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', flex: 1 }}
                  >
                    {buscandoCep ? 'Consultando...' : 'Buscar ViaCEP'}
                  </button>
                </div>

                <button
                  onClick={() => { setCepDigitado('59015000'); consultarCep('59015000'); }}
                  style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline', marginBottom: '0.9rem', display: 'block', padding: 0 }}
                >
                  Usar CEP Exemplo: CTGAS-ER (RN)
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <div style={{ background: '#161622', padding: '0.6rem', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.68rem', color: '#71717a', display: 'block' }}>LOGRADOURO</span>
                    <strong style={{ color: '#41d686', fontSize: '0.82rem' }}>{dadosCep.rua}</strong>
                  </div>
                  <div style={{ background: '#161622', padding: '0.6rem', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.68rem', color: '#71717a', display: 'block' }}>CIDADE / UF</span>
                    <strong style={{ color: '#fff', fontSize: '0.82rem' }}>{dadosCep.cidade} - {dadosCep.uf}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 3: MOVER TAREFAS */}
          {etapaAtiva === 3 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.8rem', alignItems: 'center' }}>
              <div>
                <span style={{ color: '#41d686', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Etapa 03 • Fluxo Kanban
                </span>
                <h3 style={{ color: '#fff', fontSize: '1.25rem', margin: '0.3rem 0 0.8rem 0' }}>Arrastar e Soltar (Drag & Drop)</h3>
                <p style={estiloTexto}>
                  O fluxo de trabalho avança da esquerda para a direita através de 3 status essenciais:
                </p>
                <ul style={{ ...estiloTexto, paddingLeft: '1.2rem', margin: '0.8rem 0 0 0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <li><strong style={{ color: '#818cf8' }}>A Fazer:</strong> Tarefas pendentes aguardando início.</li>
                  <li><strong style={{ color: '#f6c330' }}>Em Andamento:</strong> Atividades em execução ativa.</li>
                  <li><strong style={{ color: '#41d686' }}>Concluído:</strong> Tarefas finalizadas e entregues.</li>
                </ul>
                <p style={{ ...estiloTexto, marginTop: '0.6rem' }}>
                  Clique no cartão e arraste-o com o cursor para a coluna desejada. O status é salvo instantaneamente.
                </p>
              </div>

              {/* Simulador Mover */}
              <div style={{ background: '#0d0d14', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#41d686', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.8rem' }}>
                  <Play size={13} fill="#41d686" /> Clique na coluna para onde deseja mover:
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                  {[
                    { nome: 'A FAZER', cor: '#818cf8', icone: ListTodo },
                    { nome: 'EM ANDAMENTO', cor: '#f6c330', icone: Clock },
                    { nome: 'CONCLUÍDO', cor: '#41d686', icone: CheckCircle2 }
                  ].map(c => {
                    const ativo = colunaAtual === c.nome;
                    const Icone = c.icone;
                    return (
                      <div
                        key={c.nome}
                        onClick={() => setColunaAtual(c.nome)}
                        style={{
                          background: ativo ? '#171726' : '#111119',
                          border: `1px solid ${ativo ? c.cor : 'rgba(255, 255, 255, 0.08)'}`,
                          borderRadius: '8px',
                          padding: '0.75rem 0.5rem',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.25s ease'
                        }}
                      >
                        <div style={{ color: c.cor, fontSize: '0.72rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                          <Icone size={13} />
                          <span>{c.nome}</span>
                        </div>

                        {ativo ? (
                          <div style={{ background: '#1e1e2e', borderLeft: `3px solid ${c.cor}`, padding: '0.5rem', borderRadius: '4px', textAlign: 'left' }}>
                            <div style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 600 }}>Projeto UC12</div>
                            <span style={{ color: '#41d686', fontSize: '0.68rem' }}>Card Ativo ✓</span>
                          </div>
                        ) : (
                          <span style={{ color: '#52525b', fontSize: '0.68rem' }}>Mover para cá</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 4: NÍVEIS & FILTROS */}
          {etapaAtiva === 4 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.8rem', alignItems: 'center' }}>
              <div>
                <span style={{ color: '#41d686', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Etapa 04 • Gestão Visual
                </span>
                <h3 style={{ color: '#fff', fontSize: '1.25rem', margin: '0.3rem 0 0.8rem 0' }}>Prioridades e Filtro Instantâneo</h3>
                <p style={estiloTexto}>
                  As bordas laterais coloridas dos cartões identificam a criticidade da tarefa de forma instantânea:
                </p>
                <ul style={{ ...estiloTexto, paddingLeft: '1.2rem', margin: '0.8rem 0 0 0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <li><strong style={{ color: '#ff5065' }}>Vermelho Coral (Alta):</strong> Tarefas críticas com prazo imediato.</li>
                  <li><strong style={{ color: '#f6c330' }}>Amarelo Ouro (Média):</strong> Atividades prioritárias regulares.</li>
                  <li><strong style={{ color: '#41d686' }}>Verde Esmeralda (Baixa):</strong> Melhorias e rotinas gerais.</li>
                </ul>
              </div>

              {/* Simulador Filtros */}
              <div style={{ background: '#0d0d14', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#41d686', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.8rem' }}>
                  <Play size={13} fill="#41d686" /> Filtre os cartões abaixo:
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.9rem' }}>
                  {['TODAS', 'Alta', 'Média', 'Baixa'].map(p => {
                    const ativo = filtroPrioridade === p;
                    const cor = p === 'Alta' ? '#ff5065' : p === 'Média' ? '#f6c330' : p === 'Baixa' ? '#41d686' : '#9ca3af';
                    return (
                      <button
                        key={p}
                        onClick={() => setFiltroPrioridade(p)}
                        style={{
                          flex: 1,
                          padding: '0.4rem',
                          borderRadius: '6px',
                          border: `1px solid ${ativo ? cor : 'rgba(255,255,255,0.08)'}`,
                          background: ativo ? 'rgba(255,255,255,0.08)' : '#161622',
                          color: ativo ? cor : '#9ca3af',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {[
                    { id: 1, titulo: 'Ajuste de segurança na autenticação', prioridade: 'Alta', cor: '#ff5065' },
                    { id: 2, titulo: 'Refatoração dos componentes React', prioridade: 'Média', cor: '#f6c330' },
                    { id: 3, titulo: 'Documentação final das rotas no Sobre', prioridade: 'Baixa', cor: '#41d686' }
                  ]
                    .filter(t => filtroPrioridade === 'TODAS' || t.prioridade === filtroPrioridade)
                    .map(t => (
                      <div key={t.id} style={{ background: '#161622', borderLeft: `3px solid ${t.cor}`, padding: '0.6rem 0.8rem', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#fff', fontSize: '0.82rem' }}>{t.titulo}</span>
                        <span style={{ color: t.cor, fontSize: '0.7rem', fontWeight: 700 }}>{t.prioridade.toUpperCase()}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 5: SIDEBAR RETRÁTIL */}
          {etapaAtiva === 5 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.8rem', alignItems: 'center' }}>
              <div>
                <span style={{ color: '#41d686', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Etapa 05 • Espaço de Tela
                </span>
                <h3 style={{ color: '#fff', fontSize: '1.25rem', margin: '0.3rem 0 0.8rem 0' }}>Barra Lateral Retrátil</h3>
                <p style={estiloTexto}>
                  Em telas menores ou monitores com menor resolução, você pode recolher o menu lateral clicando no botão do topo da barra.
                </p>
                <p style={{ ...estiloTexto, marginTop: '0.6rem' }}>
                  Ao recolher, os rótulos de texto se fecham e a barra passa a ocupar apenas 70px com os ícones essenciais. Isso libera mais de 180px para que as 3 colunas do Kanban fiquem confortáveis sem necessidade de rolagem horizontal.
                </p>
              </div>

              {/* Simulador Sidebar */}
              <div style={{ background: '#0d0d14', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#41d686', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.8rem' }}>
                  <Play size={13} fill="#41d686" /> Clique para recolher ou expandir:
                </div>

                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                  <div style={{
                    width: sidebarAberta ? '160px' : '54px',
                    background: '#12121a',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    transition: 'width 0.25s ease',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                      {sidebarAberta && <strong style={{ color: '#41d686', fontSize: '0.75rem' }}>TaskFlow</strong>}
                      <button
                        onClick={() => setSidebarAberta(!sidebarAberta)}
                        style={{ background: 'none', border: 'none', color: '#41d686', cursor: 'pointer', padding: 0 }}
                      >
                        {sidebarAberta ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.72rem', color: '#d1d5db' }}>
                      <div style={{ color: '#41d686' }}>📊 {sidebarAberta && 'Dashboard'}</div>
                      <div>ℹ️ {sidebarAberta && 'Sobre'}</div>
                      <div style={{ color: '#ff5065', marginTop: '0.4rem' }}>🚪 {sidebarAberta && 'Sair'}</div>
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>
                      Estado: {sidebarAberta ? 'Modo Expandido' : 'Modo Compacto'}
                    </div>
                    <span style={{ color: '#71717a', fontSize: '0.75rem', display: 'block', marginTop: '0.2rem' }}>
                      {sidebarAberta ? 'Menu detalhado com legendas.' : 'Máximo espaço livre para o quadro Kanban.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ARQUITETURA TÉCNICA DO PROJETO */}
      <section className="secao-sobre" style={{ marginTop: '3.5rem' }}>
        <h2 className="secao-titulo" style={{ textAlign: 'center' }}>Arquitetura Técnica do Projeto</h2>
        <p className="secao-desc" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          Estrutura construída com separação clara de responsabilidades:
        </p>

        <div className="grid-arquitetura">
          <div className="card-arq card-interativo" style={{ width: '100%', alignItems: 'flex-start' }}>
            <Server size={26} className="card-arq-icone" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ width: '100%' }}>
              <h4 style={{ marginBottom: '0.4rem', textAlign: 'left' }}>Backend MVC & Express</h4>
              <p style={estiloTexto}>
                API RESTful organizada em Models, Controllers e Routes, com middlewares de validação, 
                regras de negócio isoladas e suporte a CORS configurado para Vercel e ambiente local.
              </p>
            </div>
          </div>

          <div className="card-arq card-interativo" style={{ width: '100%', alignItems: 'flex-start' }}>
            <ShieldCheck size={26} className="card-arq-icone" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ width: '100%' }}>
              <h4 style={{ marginBottom: '0.4rem', textAlign: 'left' }}>Autenticação JWT</h4>
              <p style={estiloTexto}>
                Tokens seguros para proteção de rotas privadas, interceptors de requisição com Axios 
                e persistência de sessão de usuário através do AuthContext.
              </p>
            </div>
          </div>

          <div className="card-arq card-interativo" style={{ width: '100%', alignItems: 'flex-start' }}>
            <Code2 size={26} className="card-arq-icone" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ width: '100%' }}>
              <h4 style={{ marginBottom: '0.4rem', textAlign: 'left' }}>Frontend React & Vite</h4>
              <p style={estiloTexto}>
                Estrutura componentizada em SPA, roteamento dinâmico via React Router, gerenciamento de estado 
                e microinterações com transições suaves em todos os elementos.
              </p>
            </div>
          </div>

          <div className="card-arq card-interativo" style={{ width: '100%', alignItems: 'flex-start' }}>
            <Layers size={26} className="card-arq-icone" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ width: '100%' }}>
              <h4 style={{ marginBottom: '0.4rem', textAlign: 'left' }}>Design Dark Obsidian</h4>
              <p style={estiloTexto}>
                Identidade visual com tons escuros, indicadores visuais de progresso nas colunas, 
                bordas brilhantes com código de cores por prioridade e barra lateral recolhível.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CAIXA DE ESTRUTURA OFICIAL COM BOTÃO DE COPIAR */}
      <div className="card-uc12" style={{ marginTop: '3.5rem', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, textAlign: 'left' }}>Estrutura Oficial das Soluções (UC12 • SENAI)</h3>
            <p className="secao-desc" style={{ textAlign: 'left', margin: '0.3rem 0 0 0' }}>
              Arquitetura em camadas MVC no backend integrada ao SPA React no frontend:
            </p>
          </div>

          <button
            onClick={copiarArvore}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: copiado ? 'rgba(65, 214, 134, 0.2)' : '#1c1c28',
              border: `1px solid ${copiado ? '#41d686' : 'rgba(255, 255, 255, 0.12)'}`,
              color: copiado ? '#41d686' : '#d1d5db',
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {copiado ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiado ? 'Estrutura Copiada!' : 'Copiar Árvore'}</span>
          </button>
        </div>

        <pre className="card-estrutura" style={{ margin: '0 auto', textAlign: 'left' }}>
          {arvoreEstrutura}
        </pre>
      </div>

    </div>
  );
}
