// src/componentes/ListaTarefa.jsx
// Recebe a lista de tarefas (no formato da API) e cria um TarefaItem para cada uma.
// O TarefaItem não sabe o id da tarefa: é aqui que o id é "colado" nos avisos.
//   onDeletar(tarefa.id)
//   onEditar(tarefa.id)
//   onMover(tarefa.id, coluna)   <- dois valores: o id e a coluna

import TarefaItem from './TarefaItem';

export default function ListaTarefas({
  tarefas = [],
  onDeletar,
  onEditar,
  onMover,
  colunaAnterior,
  colunaProxima,
}) {
  if (tarefas.length === 0) {
    return <p>Nenhuma tarefa aqui ainda.</p>;
  }

  return (
    <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 0, margin: 0 }}>
      {tarefas.map((tarefa) => (
        <TarefaItem
          key={tarefa.id}
          texto={tarefa.texto}
          rotuloPrioridade={tarefa.prioridade}
          corPrioridade={tarefa.prioridade_cor}
          responsavel={tarefa.usuario ?? null}
          projeto={tarefa.projeto ?? null}
          colunaAnterior={colunaAnterior}
          colunaProxima={colunaProxima}
          onDeletar={() => onDeletar?.(tarefa.id)}
          onEditar={onEditar ? () => onEditar(tarefa.id) : undefined}
          onMover={onMover ? (coluna) => onMover(tarefa.id, coluna) : undefined}
        />
      ))}
    </ul>
  );
}
