import React from 'react';
import { Workflow, Code2, KeyRound, MapPin, Boxes } from 'lucide-react';

export default function Sobre() {
  return (
    <div className="sobre-container">
      <header>
        <span className="sobre-badge">
          <Workflow size={14} /> Sobre o TaskFlow
        </span>
        <h1 className="sobre-titulo-principal">
          Um quadro Kanban para organizar o trabalho do começo ao fim
        </h1>
        <p className="sobre-subtitulo">
          O TaskFlow transforma a metodologia Kanban em uma ferramenta prática: cada tarefa é um card que
          caminha entre colunas, com prioridade visível e endereço obtido automaticamente pelo CEP.
        </p>
      </header>

      <section className="secao-sobre">
        <h2 className="secao-titulo">Metodologia Kanban</h2>
        <p className="secao-desc">
          Criada na Toyota e adotada por equipes de software, a metodologia torna o fluxo de trabalho visível,
          limita o trabalho em progresso e revela gargalos rapidamente.
        </p>
        <div className="grid-etapas">
          <div className="card-etapa">
            <h4 style={{ color: 'var(--color-high)' }}>A Fazer</h4>
            <p>Backlog priorizado. Tudo que foi combinado, mas ainda não começou.</p>
          </div>
          <div className="card-etapa">
            <h4 style={{ color: 'var(--color-medium)' }}>Em Andamento</h4>
            <p>Trabalho em execução. Limitar o volume aqui é o coração do Kanban.</p>
          </div>
          <div className="card-etapa">
            <h4 style={{ color: 'var(--color-low)' }}>Concluído</h4>
            <p>Entregas finalizadas. Serve de histórico e medida de produtividade.</p>
          </div>
        </div>
      </section>

      <section className="card-uc12">
        <h2 className="secao-titulo">Projeto acadêmico UC12</h2>
        <p className="secao-desc" style={{ marginTop: '0.4rem' }}>
          Desenvolvido para a Unidade Curricular 12 do curso Técnico em Desenvolvimento de Sistemas do <strong>SENAI CTGAS-ER</strong>. A
          proposta é aplicar, num único produto, os temas da UC: componentização, gerenciamento de estado, consumo de API
          pública, autenticação com token, rotas protegidas e boas práticas de código.
        </p>
        <div className="grid-duas-colunas">
          <ul className="lista-uc12">
            <li>CRUD completo de tarefas com confirmação de exclusão</li>
            <li>Contadores dinâmicos de total, pendentes e concluídas</li>
          </ul>
          <ul className="lista-uc12">
            <li>Botões direcionais e edição para mover cards</li>
            <li>Consulta ViaCEP com máscara e preenchimento de endereço</li>
          </ul>
        </div>
      </section>

      <section className="secao-sobre">
        <h2 className="secao-titulo">Arquitetura full stack</h2>
        <div className="grid-arquitetura">
          <div className="card-arq">
            <Code2 size={20} className="card-arq-icone" />
            <div>
              <h4>Front-end</h4>
              <p>React + Vite, JavaScript ES6+, estilização moderna e rotas com React Router.</p>
            </div>
          </div>
          <div className="card-arq">
            <KeyRound size={20} className="card-arq-icone" />
            <div>
              <h4>Autenticação</h4>
              <p>AuthContext, token persistido no localStorage, rota privada e interceptores Axios com Bearer.</p>
            </div>
          </div>
          <div className="card-arq">
            <MapPin size={20} className="card-arq-icone" />
            <div>
              <h4>Integração externa</h4>
              <p>API pública ViaCEP preenchendo cidade, estado, bairro e rua a partir do CEP.</p>
            </div>
          </div>
          <div className="card-arq">
            <Boxes size={20} className="card-arq-icone" />
            <div>
              <h4>Back-end</h4>
              <p>Rotas de API para login (emissão de token assinado) e tarefas protegidas por Bearer.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="secao-sobre">
        <h2 className="secao-titulo">Como o código está organizado</h2>
        <p className="secao-desc">
          A estrutura abaixo pode ser reproduzida no VS Code: cada arquivo tem uma responsabilidade única e é comentado para facilitar a leitura.
        </p>
        <div className="card-estrutura">
{`src/
├─ pages/           páginas: Login, kanban, Sobre
├─ componentes/     Sidebar, RotaPrivada
├─ contexts/        AuthContext (sessão + localStorage)
├─ api.js           Axios + interceptores Bearer
├─ App.jsx          gerenciamento de rotas
└─ styles.css       design system dark e animações`}
        </div>
      </section>
    </div>
  );
}
