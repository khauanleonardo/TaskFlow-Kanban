import React from "react";
import TarefaItem from "./TarefaItem";

const colunas = ["A Fazer", "Em Andamento", "Concluído"];

const ListaTarefas = ({
  tarefas,
  mudarStatus,
  deletarTarefa,
  abrirModalEdicao,
  abrirModalNovaTarefa,
  limparColuna,
}) => {
  return (
    <div className="board">
      {colunas.map((status) => (
        <div key={status} className="coluna">
          <div className="coluna-header">
            <h2>{status}</h2>
            <div className="coluna-acoes">
              <button
                onClick={() => abrirModalNovaTarefa(status)}
                title="Adicionar tarefa nesta coluna"
                className="btn-icone"
              >
                +
              </button>
              <button
                onClick={() => limparColuna(status)}
                title="Limpar todas as tarefas desta coluna"
                className="btn-icone lixeira"
              >
                🗑️
              </button>
            </div>
          </div>

          <div className="coluna-conteudo">
            {tarefas
              .filter((tarefa) => tarefa.status === status)
              .map((tarefa) => (
                <TarefaItem
                  key={tarefa.id}
                  tarefa={tarefa}
                  deletarTarefa={deletarTarefa}
                  abrirModalEdicao={abrirModalEdicao}
                  mudarStatus={mudarStatus}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListaTarefas;