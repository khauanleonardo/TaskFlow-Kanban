// src/pages/Sobre.jsx
// Página institucional e técnica sobre a arquitetura do TaskFlow, com simulador interativo

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
  Flame,
  Boxes,
  Cpu,
  ArrowRight
} from 'lucide-react';
import Avatar from '../componentes/Avatar';

export default function Sobre() {
  const [colunaSimulada, setColunaSimulada] = useState('afazer');
  const [prioridadeAtiva, setPrioridadeAtiva] = useState('urgente');
  const [abaTecnica, setAbaTecnica] = useState('frontend');

  const prioridadesInfo = {
    baixa: {
      nome: 'Baixa',
      cor: '#10B981',
      descricao: 'Demandas rotineiras, melhorias incrementais e ajustes sem impacto crítico no cronograma.',
      exemplo: 'Refatorar estilos secundários'
    },
    media: {
      nome: 'Média',
      cor: '#F59E0B',
      descricao: 'Atividades essenciais que compõem o escopo regular da sprint com prazo padrão.',
      exemplo: 'Criar validação de formulário'
    },
    alta: {
      nome: 'Alta',
      cor: '#EF4444',
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
    concluido: { titulo: 'Concluído', cor: '#10b981', icon: CheckCircle2, prox: 'afazer', rotuloProx: 'Reiniciar' }
  };

  const ColunaIcon = colunasConfig[colunaSimulada].icon;

  return (
    <div className="sobre-container">
      {/* Hero Header */}
      <div className="sobre-hero">
        <span className="badge-sobre-tag">
          <Workflow size={14} /> ARQUITETURA & TECNOLOGIA
        </span>
        <h1>Gestão Ágil com Precisão e Controle</h1>
        <p>
          O <strong>TaskFlow</strong> é uma plataforma moderna desenvolvida para sincronizar equipes, mitigar gargalos e entregar visibilidade completa em sprints de software de alta performance.
        </p>
      </div>

      {/* Grid de Pilares Arquiteturais */}
      <div className="pilares-grid">
        <div className="card-pilar">
          <div className="icone-pilar-box azul">
            <Code2 size={24} />
          </div>
          <h3>Frontend Reativo & Moderno</h3>
          <p>
            Construído em <strong>React + Vite</strong> com componentes modulares, SPA routing, animações em CSS puro e suporte nativo a temas escuro e claro.
          </p>
        </div>

        <div className="card-pilar">
          <div className="icone-pilar-box roxo">
            <Cpu size={24} />
          </div>
          <h3>API RESTful & Middleware</h3>
          <p>
            Backend robusto em <strong>Node.js + Express</strong>, autenticação JWT, validação rigorosa de schemas e tratamento centralizado de exceções.
          </p>
        </div>

        <div className="card-pilar">
          <div className="icone-pilar-box verde">
            <Database size={24} />
          </div>
          <h3>Persistência em Nuvem</h3>
          <p>
            Banco de dados <strong>PostgreSQL na Neon Cloud</strong>, modelagem relacional normalizada com Prisma ORM e pool de conexões otimizado.
          </p>
        </div>

        <div className="card-pilar">
          <div className="icone-pilar-box amarelo">
            <ShieldCheck size={24} />
          </div>
          <h3>Testes Automatizados</h3>
          <p>
            Suíte completa com <strong>Jest</strong> cobrindo testes unitários, tradução de códigos de erro e conformidade de schemas para garantia de qualidade.
          </p>
        </div>
      </div>

      {/* Seção Interativa: Simulador de Card Kanban */}
      <div className="secao-simulador-card">
        <div className="cabecalho-secao-centro">
          <span className="badge-sprint-topo">
            <Sparkles size={13} /> EXPERIMENTE EM TEMPO REAL
          </span>
          <h2>Simulador Interativo de Estados</h2>
          <p>Alterne as prioridades e a coluna abaixo para visualizar o comportamento visual de cada card no sistema.</p>
        </div>

        <div className="simulador-grid">
          {/* Controles do Simulador */}
          <div className="controles-simulador">
            <div className="grupo-controle">
              <label>Selecione a Prioridade:</label>
              <div className="botoes-seletor-prioridade">
                {Object.keys(prioridadesInfo).map((chave) => (
                  <button
                    key={chave}
                    type="button"
                    className={`btn-sel-pri ${prioridadeAtiva === chave ? 'ativo' : ''} ${chave}`}
                    onClick={() => setPrioridadeAtiva(chave)}
                  >
                    {prioridadesInfo[chave].nome}
                  </button>
                ))}
              </div>
            </div>

            <div className="info-prioridade-ativa">
              <strong>{prioridadesInfo[prioridadeAtiva].nome}:</strong> {prioridadesInfo[prioridadeAtiva].descricao}
            </div>

            <div className="grupo-controle">
              <label>Avançar Estágio:</label>
              <button
                type="button"
                className="btn-avancar-simulador"
                onClick={() => setColunaSimulada(colunasConfig[colunaSimulada].prox)}
              >
                <span>Avançar para: {colunasConfig[colunasConfig[colunaSimulada].prox].titulo}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Prévia do Card Simulado */}
          <div className="previa-card-wrapper">
            <div className={`card-tarefa-kanban simulado prioridade-${prioridadeAtiva}`}>
              <div className="card-linha-superior">
                <span className="chip-projeto-tag">
                  <Workflow size={11} /> TaskFlow Demo
                </span>
                <span className={`badge-prioridade-card badge-${prioridadeAtiva}`}>
                  <span className="ponto-prioridade"></span>
                  {prioridadeAtiva.toUpperCase()}
                </span>
              </div>

              <div className="card-corpo-conteudo">
                <h4 className="titulo-tarefa-card">
                  {prioridadesInfo[prioridadeAtiva].exemplo}
                </h4>
                <p className="descricao-tarefa-card">
                  Demonstração da renderização dinâmica de prioridades, status e avatar em conformidade com o design system do TaskFlow.
                </p>
              </div>

              <div className="card-rodape-acoes">
                <div className="membro-responsavel-box">
                  <Avatar usuario={{ nome: 'Khauan Leonardo' }} tamanho="sm" online={true} />
                  <span className="nome-responsavel-card">Khauan Leonardo</span>
                </div>
                <div className="badge-estagio-simulado">
                  <ColunaIcon size={13} />
                  <span>{colunasConfig[colunaSimulada].titulo}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
