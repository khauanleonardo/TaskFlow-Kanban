import React from "react";

const Header = ({
  tarefas,
  filtroPrioridade,
  setFiltroPrioridade,
  abrirModalNovaTarefa,
}) => {
  const concluidas = tarefas.filter((t) => t.status === "Concluído").length;
  const total = tarefas.length;

  return (
    <header className="header">
      <div className="header-info">
        <h1>Meu Kanban</h1>
        <p>
          Tarefas Concluídas: {concluidas} de {total}
        </p>
      </div>

      <div className="header-controles">
        <select
          value={filtroPrioridade}
          onChange={(e) => setFiltroPrioridade(e.target.value)}
          className="select-filtro"
        >
          <option value="Todas">Todas as Prioridades</option>
          <option value="Baixa">Baixa</option>
          <option value="Média">Média</option>
          <option value="Alta">Alta</option>
        </select>

        <button onClick={abrirModalNovaTarefa} className="btn-adicionar">
          + Nova Tarefa
        </button>
      </div>
    </header>
  );
};

export default Header;