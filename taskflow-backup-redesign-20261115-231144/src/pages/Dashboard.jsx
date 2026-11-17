// src/pages/Dashboard.jsx
// Painel de Visão Geral com KPIs, gráfico de produtividade, atividades e tabela de projetos

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import { 
  ListTodo, 
  Clock, 
  CheckCircle2, 
  Flame, 
  ArrowRight, 
  Kanban, 
  FolderKanban, 
  TrendingUp, 
  Sparkles,
  Users,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import Avatar from '../componentes/Avatar';
import { MEMBROS_EQUIPE_PADRAO } from '../utils/funcionarios';

export default function Dashboard() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [tarefas, setTarefas] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        const [respTarefas, respProjetos] = await Promise.allSettled([
          api.get('/tarefas'),
          api.get('/projetos')
        ]);

        if (respTarefas.status === 'fulfilled') {
          setTarefas(Array.isArray(respTarefas.value.data) ? respTarefas.value.data : []);
        }
        if (respProjetos.status === 'fulfilled') {
          setProjetos(Array.isArray(respProjetos.value.data) ? respProjetos.value.data : []);
        }
      } catch (e) {
        console.error('Erro ao carregar dados do dashboard:', e);
      } finally {
        setCarregando(false);
      }
    }
    carregarDados();
  }, []);

  // Métricas calculadas
  const totalTarefas = tarefas.length;
  const afazerCount = tarefas.filter(t => t.coluna === 'afazer' || t.coluna === 'todo').length;
  const andamentoCount = tarefas.filter(t => t.coluna === 'andamento' || t.coluna === 'doing').length;
  const concluidoCount = tarefas.filter(t => t.coluna === 'concluido' || t.coluna === 'done').length;
  const urgentesCount = tarefas.filter(t => 
    (t.prioridade && t.prioridade.toLowerCase() === 'urgente') ||
    t.idprioridade === 4 ||
    t.idprioridade === 3
  ).length;

  const taxaConclusao = totalTarefas > 0 ? Math.round((concluidoCount / totalTarefas) * 100) : 0;

  // Lista de atividades recentes integrando funcionários
  const atividadesRecentes = [
    {
      id: 1,
      membro: MEMBROS_EQUIPE_PADRAO[1], // Ana Lima
      acao: 'concluiu a tarefa',
      tarefa: tarefas[0]?.texto || 'Otimizar responsividade do Kanban',
      tempo: 'Há 12 min'
    },
    {
      id: 2,
      membro: MEMBROS_EQUIPE_PADRAO[2], // Carlos Eduardo
      acao: 'moveu para Em Andamento',
      tarefa: tarefas[1]?.texto || 'Configuração das suítes de testes Jest',
      tempo: 'Há 45 min'
    },
    {
      id: 3,
      membro: MEMBROS_EQUIPE_PADRAO[0], // Lucas Almeida
      acao: 'atualizou os protótipos de UX de',
      tarefa: 'Fluxo de navegação e layout dark',
      tempo: 'Hoje às 09:15'
    },
    {
      id: 4,
      membro: MEMBROS_EQUIPE_PADRAO[3], // Mariana Costa
      acao: 'validou casos de teste em',
      tarefa: 'Validação de campos e rotas protegidas',
      tempo: 'Ontem às 17:30'
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Cabeçalho do Dashboard */}
      <div className="dashboard-cabecalho">
        <div className="saudacao-bloco">
          <span className="badge-sprint-topo">
            <Sparkles size={13} /> SPRINT EM ANDAMENTO
          </span>
          <h1>Visão Geral da Plataforma</h1>
          <p>
            Olá, <strong>{usuario?.nome || 'Admin'}</strong>! Acompanhe o fluxo de tarefas, métricas de produtividade e a atuação da equipe em tempo real.
          </p>
        </div>

        <div className="acoes-cabecalho-dash">
          <button
            type="button"
            className="btn-ir-kanban"
            onClick={() => navigate('/kanban')}
          >
            <Kanban size={17} />
            <span>Abrir Quadro Kanban</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Grid de KPIs Superiores */}
      <div className="kpis-grid">
        {/* KPI 1: Total */}
        <div className="card-kpi kpi-total">
          <div className="kpi-topo">
            <span className="rotulo-kpi">Total de Tarefas</span>
            <div className="icone-kpi-circulo total">
              <ListTodo size={20} />
            </div>
          </div>
          <div className="valor-kpi-bloco">
            <span className="numero-kpi">{carregando ? '...' : totalTarefas}</span>
            <span className="tag-kpi-sucesso">
              <TrendingUp size={12} /> Ativas
            </span>
          </div>
          <span className="subtexto-kpi">Distribuídas em 3 colunas de execução</span>
        </div>

        {/* KPI 2: Em Andamento */}
        <div className="card-kpi kpi-andamento">
          <div className="kpi-topo">
            <span className="rotulo-kpi">Em Andamento</span>
            <div className="icone-kpi-circulo andamento">
              <Clock size={20} />
            </div>
          </div>
          <div className="valor-kpi-bloco">
            <span className="numero-kpi">{carregando ? '...' : andamentoCount}</span>
            <span className="tag-kpi-alerta">Foco do Time</span>
          </div>
          <span className="subtexto-kpi">Sendo trabalhadas pela equipe agora</span>
        </div>

        {/* KPI 3: Concluídas */}
        <div className="card-kpi kpi-concluido">
          <div className="kpi-topo">
            <span className="rotulo-kpi">Concluídas</span>
            <div className="icone-kpi-circulo concluido">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="valor-kpi-bloco">
            <span className="numero-kpi">{carregando ? '...' : concluidoCount}</span>
            <span className="tag-kpi-progresso">{taxaConclusao}% da sprint</span>
          </div>
          <span className="subtexto-kpi">Entregas aprovadas e validadas</span>
        </div>

        {/* KPI 4: Urgentes / Atenção */}
        <div className="card-kpi kpi-urgente">
          <div className="kpi-topo">
            <span className="rotulo-kpi">Urgentes / Alta</span>
            <div className="icone-kpi-circulo urgente">
              <Flame size={20} />
            </div>
          </div>
          <div className="valor-kpi-bloco">
            <span className="numero-kpi">{carregando ? '...' : urgentesCount}</span>
            <span className="tag-kpi-urgente">Prioridade Máxima</span>
          </div>
          <span className="subtexto-kpi">Demandam foco imediato para liberação</span>
        </div>
      </div>

      {/* Linha Intermediária: Gráfico de Produtividade e Atividades Recentes */}
      <div className="linha-grafico-atividades">
        {/* Gráfico de Distribuição / Produtividade */}
        <div className="card-painel card-grafico-produtividade">
          <div className="cabecalho-painel">
            <div>
              <h3>Produtividade do Fluxo de Trabalho</h3>
              <p>Distribuição volumétrica das tarefas por estágio da sprint</p>
            </div>
            <span className="chip-taxa">Taxa de Conclusão: {taxaConclusao}%</span>
          </div>

          <div className="grafico-barras-interativo">
            {/* Barra A Fazer */}
            <div className="coluna-grafico-item">
              <div className="trilho-barra-vertical">
                <div 
                  className="preenchimento-barra afazer"
                  style={{ height: `${totalTarefas > 0 ? (afazerCount / totalTarefas) * 100 : 20}%` }}
                >
                  <span className="valor-sobre-barra">{afazerCount}</span>
                </div>
              </div>
              <span className="rotulo-barra-status">A Fazer</span>
              <span className="porcentagem-barra">{totalTarefas > 0 ? Math.round((afazerCount / totalTarefas) * 100) : 0}%</span>
            </div>

            {/* Barra Em Andamento */}
            <div className="coluna-grafico-item">
              <div className="trilho-barra-vertical">
                <div 
                  className="preenchimento-barra andamento"
                  style={{ height: `${totalTarefas > 0 ? (andamentoCount / totalTarefas) * 100 : 35}%` }}
                >
                  <span className="valor-sobre-barra">{andamentoCount}</span>
                </div>
              </div>
              <span className="rotulo-barra-status">Em Andamento</span>
              <span className="porcentagem-barra">{totalTarefas > 0 ? Math.round((andamentoCount / totalTarefas) * 100) : 0}%</span>
            </div>

            {/* Barra Concluído */}
            <div className="coluna-grafico-item">
              <div className="trilho-barra-vertical">
                <div 
                  className="preenchimento-barra concluido"
                  style={{ height: `${totalTarefas > 0 ? (concluidoCount / totalTarefas) * 100 : 50}%` }}
                >
                  <span className="valor-sobre-barra">{concluidoCount}</span>
                </div>
              </div>
              <span className="rotulo-barra-status">Concluído</span>
              <span className="porcentagem-barra">{totalTarefas > 0 ? Math.round((concluidoCount / totalTarefas) * 100) : 0}%</span>
            </div>
          </div>

          <div className="legenda-grafico-fluxo">
            <div className="item-legenda"><span className="ponto-legenda afazer"></span> Backlog Planejado</div>
            <div className="item-legenda"><span className="ponto-legenda andamento"></span> Execução em Foco</div>
            <div className="item-legenda"><span className="ponto-legenda concluido"></span> Entregas Concluídas</div>
          </div>
        </div>

        {/* Atividades Recentes com Fotos da Equipe */}
        <div className="card-painel card-atividades-recentes">
          <div className="cabecalho-painel">
            <div>
              <h3>Atividades Recentes da Equipe</h3>
              <p>Histórico de movimentações e entregas em tempo real</p>
            </div>
          </div>

          <div className="lista-atividades-fluxo">
            {atividadesRecentes.map((item) => (
              <div key={item.id} className="item-atividade-fluxo">
                <Avatar 
                  usuario={{ nome: item.membro.nome, email: item.membro.email }}
                  tamanho="sm" 
                  online={item.membro.online}
                />
                <div className="corpo-atividade-fluxo">
                  <p className="texto-atividade-fluxo">
                    <strong>{item.membro.nome}</strong> {item.acao}{' '}
                    <span className="nome-tarefa-destaque">"{item.tarefa}"</span>
                  </p>
                  <span className="tempo-atividade-fluxo">{item.tempo}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="rodape-atividades-painel">
            <button 
              type="button" 
              onClick={() => navigate('/kanban')} 
              className="btn-ver-quadro-completo"
            >
              <span>Ver todas as tarefas no quadro</span>
              <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Linha Inferior: Tabela de Projetos & Card de Foco */}
      <div className="linha-projetos-foco">
        {/* Tabela de Projetos Ativos */}
        <div className="card-painel card-tabela-projetos">
          <div className="cabecalho-painel">
            <div>
              <h3>Projetos em Execução</h3>
              <p>Status de avanço e membros alocados em cada iniciativa</p>
            </div>
          </div>

          <div className="tabela-projetos-wrapper">
            <table className="tabela-projetos-estilizada">
              <thead>
                <tr>
                  <th>Projeto</th>
                  <th>Status</th>
                  <th>Progresso</th>
                  <th>Membros Envolvidos</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="info-projeto-celula">
                      <FolderKanban size={16} className="icone-projeto-tabela" />
                      <div>
                        <strong>TaskFlow Core & API</strong>
                        <span>Plataforma Principal</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge-status-tabela ativo">Em Produção</span>
                  </td>
                  <td>
                    <div className="barra-progresso-projeto">
                      <div className="progresso-linha" style={{ width: '85%' }}></div>
                      <span className="porcentagem-texto">85%</span>
                    </div>
                  </td>
                  <td>
                    <div className="avatares-sobrepostos">
                      <Avatar usuario={{ nome: 'Ana Lima' }} tamanho="xs" />
                      <Avatar usuario={{ nome: 'Carlos Eduardo' }} tamanho="xs" />
                      <Avatar usuario={{ nome: 'Khauan Leonardo' }} tamanho="xs" />
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>
                    <div className="info-projeto-celula">
                      <FolderKanban size={16} className="icone-projeto-tabela" />
                      <div>
                        <strong>Módulo de Autenticação JWT</strong>
                        <span>Segurança & Sessão</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge-status-tabela concluido">Concluído</span>
                  </td>
                  <td>
                    <div className="barra-progresso-projeto">
                      <div className="progresso-linha concluida" style={{ width: '100%' }}></div>
                      <span className="porcentagem-texto">100%</span>
                    </div>
                  </td>
                  <td>
                    <div className="avatares-sobrepostos">
                      <Avatar usuario={{ nome: 'Carlos Eduardo' }} tamanho="xs" />
                      <Avatar usuario={{ nome: 'Mariana Costa' }} tamanho="xs" />
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>
                    <div className="info-projeto-celula">
                      <FolderKanban size={16} className="icone-projeto-tabela" />
                      <div>
                        <strong>Suíte de Testes Automatizados</strong>
                        <span>Jest & Cobertura de Código</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge-status-tabela progresso">30 Testes OK</span>
                  </td>
                  <td>
                    <div className="barra-progresso-projeto">
                      <div className="progresso-linha" style={{ width: '92%' }}></div>
                      <span className="porcentagem-texto">92%</span>
                    </div>
                  </td>
                  <td>
                    <div className="avatares-sobrepostos">
                      <Avatar usuario={{ nome: 'Mariana Costa' }} tamanho="xs" />
                      <Avatar usuario={{ nome: 'Khauan Leonardo' }} tamanho="xs" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Card Motivacional / Foco do Dia */}
        <div className="card-painel card-banner-foco">
          <div className="icone-foco-destaque">
            <Sparkles size={28} />
          </div>
          <h3>Excelência no Fluxo Ágil</h3>
          <p>
            "Qualidade não é um ato, é um hábito. Mantenha os limites de trabalho em progresso (WIP) equilibrados para entregas contínuas de alto valor."
          </p>
          <div className="rodape-card-foco">
            <span className="chip-foco-dia">Foco da Semana</span>
            <button
              type="button"
              onClick={() => navigate('/kanban')}
              className="btn-foco-acao"
            >
              <span>Gerenciar Tarefas</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
