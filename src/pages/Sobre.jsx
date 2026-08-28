import React from "react";

export default function Sobre() {
  return (
    <div
      style={{
        color: "#fff",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "10px",
      }}
    >
      {/* Título Principal */}
      <h1 style={{ color: "#00b37e", marginBottom: "10px" }}>
        Sobre o TaskFlow
      </h1>
      <p
        style={{
          color: "#8d8d99",
          fontSize: "16px",
          marginBottom: "30px",
          lineHeight: "1.6",
        }}
      >
        O TaskFlow é uma aplicação web interativa baseada no método Kanban,
        projetada para otimizar a organização e a produtividade no gerenciamento
        de tarefas diárias.
      </p>

      {/* Seção: Objetivo */}
      <div
        style={{
          backgroundColor: "#202024",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid #323238",
        }}
      >
        <h3 style={{ color: "#fff", marginTop: 0 }}>🎯 Objetivo do Projeto</h3>
        <p
          style={{
            color: "#c4c4cc",
            fontSize: "14px",
            lineHeight: "1.6",
            margin: 0,
          }}
        >
          Oferecer uma interface simples e moderna para acompanhar o ciclo de
          vida das tarefas através das etapas de <strong>A Fazer</strong>,{" "}
          <strong>Em Andamento</strong> e <strong>Concluído</strong>, garantindo
          clareza na distribuição do trabalho.
        </p>
      </div>

      {/* Seção: Funcionalidades */}
      <div
        style={{
          backgroundColor: "#202024",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid #323238",
        }}
      >
        <h3 style={{ color: "#fff", marginTop: 0 }}>
          ✨ Funcionalidades Detalhadas
        </h3>
        <ul
          style={{
            color: "#c4c4cc",
            fontSize: "14px",
            lineHeight: "1.8",
            paddingLeft: "20px",
            margin: 0,
          }}
        >
          <li>
            <strong>Autenticação Simples:</strong> Login seguro para acessar o
            painel principal.
          </li>
          <li>
            <strong>Organização por Colunas:</strong> Arraste/mova tarefas entre
            colunas conforme o progresso.
          </li>
          <li>
            <strong>Níveis de Prioridade:</strong> Classificação visual por
            cores (🟢 Baixa, 🟡 Média e 🔴 Alta).
          </li>
          <li>
            <strong>Busca de Endereço Automática:</strong> Integração com a API
            do ViaCEP para preenchimento de Cidade/UF a partir do CEP.
          </li>
          <li>
            <strong>Contadores em Tempo Real:</strong> Indicadores dinâmicos do
            total de tarefas, pendentes e concluídas.
          </li>
        </ul>
      </div>

      {/* Seção: Tecnologias */}
      <div
        style={{
          backgroundColor: "#202024",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #323238",
        }}
      >
        <h3 style={{ color: "#fff", marginTop: 0 }}>
          🛠️ Tecnologias Utilizadas
        </h3>
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "10px",
          }}
        >
          <span
            style={{
              backgroundColor: "#323238",
              color: "#00b37e",
              padding: "6px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            React
          </span>
          <span
            style={{
              backgroundColor: "#323238",
              color: "#00b37e",
              padding: "6px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            TypeScript
          </span>
          <span
            style={{
              backgroundColor: "#323238",
              color: "#00b37e",
              padding: "6px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            React Router
          </span>
          <span
            style={{
              backgroundColor: "#323238",
              color: "#00b37e",
              padding: "6px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            ViaCEP API
          </span>
        </div>
      </div>
    </div>
  );
}
