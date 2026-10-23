import React, { useState } from 'react';
import { 
  Workflow, 
  Code2, 
  Database, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Flame,
  Boxes
} from 'lucide-react';

export default function Sobre() {
  // Estado para simulação do card de exemplo
  const [colunaSimulada, setColunaSimulada] = useState('afazer');
  // Estado para visualização interativa das prioridades
  const [prioridadeAtiva, setPrioridadeAtiva] = useState('urgente');
  // Estado para as abas técnicas de arquitetura
  const [abaTecnica, setAbaTecnica] = useState('frontend');

  const prioridadesInfo = {
    baixa: {
      nome: 'Baixa',
      cor: '#41D686',
      descricao: 'Demandas rotineiras, melhorias incrementais e ajustes sem impacto crítico no cronograma.',
      exemplo: 'Refatorar estilos secundários'
    },
    media: {
      nome: 'Média',
      cor: '#F6C330',
      descricao: 'Atividades essenciais que compõem o escopo regular da sprint com prazo padrão.',
      exemplo: 'Criar validação de formulário'
    },
    alta: {
      nome: 'Alta',
      cor: '#FF5065',
      descricao: 'Funcionalidades centrais da entrega atual que exigem foco prioritário do time.',
      exemplo: 'Integrar autenticação JWT'
    },
    urgente: {
      nome: 'Urgente',
      cor: '#A855F7',
      descricao: 'Bloqueios críticos, falhas de sistema ou impedimentos que exigem resolução imediata.',
      exemplo: 'Corrigir queda da API no login'
    }
  };

  const colunasConfig = {
    afazer: { titulo: 'A Fazer', cor: '#38bdf8', icon: Clock, prox: 'andamento', rotuloProx: 'Iniciar' },
    andamento: { titulo: 'Em Andamento', cor: '#f59e0b', icon: Layers, prox: 'concluido', rotuloProx: 'Finalizar' },
    concluido: { titulo: 'Concluído', cor: '#41d686', icon: CheckCircle2, prox: 'afazer', rotuloProx: 'Reiniciar' }
  };

  const ColunaIcon = colunasConfig[colunaSimulada].icon;

  return (
    <div className="sobre-container">
      {/* HERO COM GRADIENTE E BADGE */}
      <header className="sobre-hero">
        <div className="sobre-badge">
          <Workflow size={14} /> Sistema Kanban Full Stack
        </div>
        <h1 className="sobre-titulo-principal">
          Gestão Ágil de Tarefas com <span className="texto-destaque-gradiente">Precisão e Controle</span>
        </h1>
        <p className="sobre-subtitulo">
          O TaskFlow é uma plataforma visual para gerenciamento de fluxo contínuo. 
          Projetada com arquitetura desacoplada, priorização estratégica em 4 níveis e 
          persistência em banco de dados na nuvem.
        </p>

        {/* MÉTRICAS RÁPIDAS EM CHIPS */}
        <div className="sobre-metricas-grid">
          <div className="sobre-metrica-card">
            <span className="metrica-numero">3</span>
            <span className="metrica-label">Fases de Fluxo</span>
          </div>
          <div className="sobre-metrica-card">
            <span className="metrica-numero" style={{ color: '#A855F7' }}>4</span>
            <span className="metrica-label">Níveis de Prioridade</span>
          </div>
          <div className="sobre-metrica-card">
            <span className="metrica-numero" style={{ color: '#41d686' }}>100%</span>
            <span className="metrica-label">Nuvem Serverless</span>
          </div>
          <div className="sobre-metrica-card">
            <span className="metrica-numero" style={{ color: '#38bdf8' }}>MVC</span>
            <span className="metrica-label">API Estruturada</span>
          </div>
        </div>
      </header>

      {/* SEÇÃO 1: SIMULADOR INTERATIVO DO FLUXO KANBAN */}
      <section className="secao-sobre secao-interativa">
        <div className="secao-cabecalho-linha">
          <div>
            <h2 className="secao-titulo">Simulador do Ciclo de Vida da Tarefa</h2>
            <p className="secao-desc">
              Experimente a transição de estado que ocorre no quadro real. Clique no botão de avanço para ver o card caminhar entre as colunas.
            </p>
          </div>
        </div>

        <div className="simulador-box">
          <div className="simulador-colunas-tabs">
            {Object.keys(colunasConfig).map((colKey) => (
              <button
                key={colKey}
                type="button"
                className={`simulador-tab ${colunaSimulada === colKey ? 'ativa' : ''}`}
                style={{ borderColor: colunaSimulada === colKey ? colunasConfig[colKey].cor : 'transparent' }}
                onClick={() => setColunaSimulada(colKey)}
              >
                <span className="bolinha-indicadora" style={{ background: colunasConfig[colKey].cor }} />
                {colunasConfig[colKey].titulo}
              </button>
            ))}
          </div>

          <div className="simulador-card-preview">
            <div className="preview-card-cabecalho">
              <span className="badge-prioridade-demo" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#A855F7', border: '1px solid rgba(168, 85, 247, 0.35)' }}>
                <Flame size={12} /> Urgente
              </span>
              <span className="status-badge" style={{ color: colunasConfig[colunaSimulada].cor }}>
                <ColunaIcon size={14} style={{ marginRight: 4, verticalAlign: -2 }} />
                {colunasConfig[colunaSimulada].titulo}
              </span>
            </div>
            <h3 className="preview-card-titulo">Refatorar consultas e indexar banco de dados</h3>
            <p className="preview-card-desc">
              Exemplo de card em trânsito no quadro. O sistema persiste a coluna e a ordem de cada item no banco PostgreSQL.
            </p>

            <div className="preview-card-acoes">
              <button
                type="button"
                className="btn-avancar-demo"
                onClick={() => setColunaSimulada(colunasConfig[colunaSimulada].prox)}
              >
                <span>{colunasConfig[colunaSimulada].rotuloProx} tarefa</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: SELETOR DINÂMICO DE PRIORIDADES */}
      <section className="secao-sobre">
        <h2 className="secao-titulo">Sistema de Prioridades com 4 Níveis</h2>
        <p className="secao-desc">
          O TaskFlow organiza as demandas por criticidade. Clique em qualquer nível para ver a definição de cor e o critério de priorização:
        </p>

        <div className="grid-prioridades-interativo">
          {Object.entries(prioridadesInfo).map(([chave, item]) => {
            const selecionada = prioridadeAtiva === chave;
            return (
              <div
                key={chave}
                className={`card-prioridade-demo ${selecionada ? 'selecionada' : ''}`}
                style={{ borderColor: selecionada ? item.cor : 'var(--border-card)' }}
                onClick={() => setPrioridadeAtiva(chave)}
              >
                <div className="prioridade-demo-topo">
                  <span className="ponto-cor" style={{ background: item.cor }} />
                  <strong style={{ color: item.cor }}>{item.nome}</strong>
                </div>
                <p className="prioridade-demo-texto">{item.descricao}</p>
                <div className="prioridade-demo-exemplo">
                  <small>Exemplo:</small>
                  <span>"{item.exemplo}"</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SEÇÃO 3: ABAS TÉCNICAS DE ENGENHARIA */}
      <section className="secao-sobre">
        <h2 className="secao-titulo">Arquitetura de Software</h2>
        <p className="secao-desc">
          Construído com base nas competências de desenvolvimento full stack, integrando front-end moderno, API REST e banco relacional:
        </p>

        <div className="abas-container">
          <div className="abas-botoes">
            <button
              type="button"
              className={`aba-btn ${abaTecnica === 'frontend' ? 'ativo' : ''}`}
              onClick={() => setAbaTecnica('frontend')}
            >
              <Code2 size={16} /> Front-End
            </button>
            <button
              type="button"
              className={`aba-btn ${abaTecnica === 'backend' ? 'ativo' : ''}`}
              onClick={() => setAbaTecnica('backend')}
            >
              <Boxes size={16} /> Back-End (API)
            </button>
            <button
              type="button"
              className={`aba-btn ${abaTecnica === 'banco' ? 'ativo' : ''}`}
              onClick={() => setAbaTecnica('banco')}
            >
              <Database size={16} /> Banco de Dados
            </button>
            <button
              type="button"
              className={`aba-btn ${abaTecnica === 'seguranca' ? 'ativo' : ''}`}
              onClick={() => setAbaTecnica('seguranca')}
            >
              <ShieldCheck size={16} /> Segurança
            </button>
          </div>

          <div className="aba-conteudo">
            {abaTecnica === 'frontend' && (
              <div className="painel-aba-detalhes">
                <h3>Interface SPA Reativa</h3>
                <p>
                  Desenvolvido com <strong>React 18 + Vite</strong>, garantindo carregamento ultrarrápido e manipulação de estado otimizada.
                </p>
                <ul className="lista-pontos-tecnicos">
                  <li><strong>Kanban Reativo:</strong> atualização instantânea de colunas, contadores em tempo real e filtros combinados.</li>
                  <li><strong>Design System Dark:</strong> paleta moderna com alto contraste e acessibilidade visual.</li>
                  <li><strong>Cliente HTTP Axios:</strong> integração com interceptores e tratamento padronizado de respostas.</li>
                </ul>
              </div>
            )}

            {abaTecnica === 'backend' && (
              <div className="painel-aba-detalhes">
                <h3>API REST com Arquitetura MVC</h3>
                <p>
                  Construída com <strong>Node.js e Express</strong>, aplicando separação rigorosa de responsabilidades entre rotas, regras de negócio e acesso a dados.
                </p>
                <ul className="lista-pontos-tecnicos">
                  <li><strong>Validação Declarativa:</strong> validação de tipos, enums de colunas e identificadores inteiros via middlewares.</li>
                  <li><strong>Tratamento Global de Erros:</strong> middleware centralizado que captura exceções e devolve respostas no padrão JSON.</li>
                  <li><strong>Pool de Conexões Otimizado:</strong> gerenciamento inteligente de conexões com keep-alive no PostgreSQL.</li>
                </ul>
              </div>
            )}

            {abaTecnica === 'banco' && (
              <div className="painel-aba-detalhes">
                <h3>PostgreSQL no Neon Serverless</h3>
                <p>
                  Banco relacional escalável com integridade referencial por chaves primárias e estrangeiras.
                </p>
                <ul className="lista-pontos-tecnicos">
                  <li><strong>Tabela de Prioridades:</strong> suporte a 4 níveis cadastrados com cores, descrições e integridade referencial.</li>
                  <li><strong>Relacionamentos Fortes:</strong> tarefas vinculadas a projetos, usuários e prioridades com deleção em cascata segura.</li>
                  <li><strong>Transações e Constraints:</strong> validações de colunas e estados em nível de banco para consistência absoluta.</li>
                </ul>
              </div>
            )}

            {abaTecnica === 'seguranca' && (
              <div className="painel-aba-detalhes">
                <h3>Autenticação e Proteção de Dados</h3>
                <p>
                  Proteção nas rotas de negócio contra acessos não autorizados e requisições malformadas.
                </p>
                <ul className="lista-pontos-tecnicos">
                  <li><strong>Autenticação JWT:</strong> geração e validação de tokens seguros com prazo de expiração.</li>
                  <li><strong>Proteção CORS:</strong> controle estrito de origens autorizadas para consumo da API.</li>
                  <li><strong>Sanitização de Entradas:</strong> parâmetros tipados impedindo injeções de dados inválidos.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: ESTRUTURA DO PROJETO */}
      <section className="secao-sobre">
        <h2 className="secao-titulo">Organização dos Arquivos</h2>
        <p className="secao-desc">
          Estrutura limpa e escalável para fácil manutenção e trabalho em equipe:
        </p>
        <div className="card-estrutura">
{`taskflow/
├── front-end/
│   ├── src/pages/       (kanban.jsx, Sobre.jsx, Login.jsx)
│   ├── src/componentes/ (Sidebar.jsx, RotaPrivada.jsx)
│   ├── src/api.js       (Configuração Axios)
│   └── src/styles.css   (Design System dark)
└── back-end/
    ├── src/controllers/ (Regras de requisição e resposta)
    ├── src/models/      (Acesso ao banco e consultas SQL)
    ├── src/middlewares/ (Validação declarativa e tratamento de erros)
    ├── src/schemas/     (Contratos de dados)
    └── server.js        (Inicialização e rotas Express)`}
        </div>
      </section>
    </div>
  );
}
