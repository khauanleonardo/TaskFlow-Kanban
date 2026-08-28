import React from "react";

const TarefaItem = ({
  tarefa,
  deletarTarefa,
  abrirModalEdicao,
  mudarStatus,
}) => {
  return (
    <div
      className={`tarefa-card prioridade-${tarefa.prioridade.toLowerCase()}`}
      onDoubleClick={() => abrirModalEdicao(tarefa)}
      title="Dê um duplo clique para editar esta tarefa"
    >
      <div className="tarefa-header">
        <h3>{tarefa.titulo}</h3>
        <span className={`badge ${tarefa.prioridade.toLowerCase()}`}>
          {tarefa.prioridade}
        </span>
      </div>

      <p>{tarefa.descricao}</p>

      <div className="tarefa-footer">
        <select
          value={tarefa.status}
          onChange={(e) => mudarStatus(tarefa.id, e.target.value)}
          onClick={(e) => e.stopPropagation()} 
          className="select-status"
        >
          <option value="A Fazer">A Fazer</option>
          <option value="Em Andamento">Em Andamento</option>
          <option value="Concluído">Concluído</option>
        </select>

        <button
          onClick={(e) => {
            e.stopPropagation();
            deletarTarefa(tarefa.id);
          }}
          className="btn-deletar"
        >
          Excluir
        </button>
      </div>
    </div>
  );
};

export default TarefaItem;