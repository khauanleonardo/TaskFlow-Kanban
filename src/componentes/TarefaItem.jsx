// src/componentes/TarefaItem.jsx
// Um card de tarefa. Ele não move nem apaga nada sozinho: só AVISA o pai,
// chamando as props onMover, onDeletar e onEditar.
//
// modo lista:  sem onMover -> só o botão X aparece
// modo Kanban: com onMover -> botões ← → e X
//   ← aparece só se existir colunaAnterior
//   → aparece só se existir colunaProxima
// editar: duplo clique no texto chama onEditar

import styles from './TarefaItem.module.css';

export default function TarefaItem({
  texto,
  rotuloPrioridade,
  corPrioridade,
  responsavel,
  projeto,
  onMover,
  colunaAnterior,
  colunaProxima,
  onDeletar,
  onEditar,
}) {
  const modoKanban = typeof onMover === 'function';

  return (
    <li className={styles.tarefa}>
      <div className={styles.topo}>
        <span
          className={styles.textoTarefa}
          onDoubleClick={onEditar}
          title="Dê dois cliques para editar"
        >
          {texto}
        </span>
        <span
          className={styles.badge}
          style={corPrioridade ? { backgroundColor: corPrioridade } : undefined}
        >
          {rotuloPrioridade || 'Sem prioridade'}
        </span>
      </div>

      {(responsavel !== undefined || projeto !== undefined) && (
        <div className={styles.detalhes}>
          <span>{responsavel || 'Sem responsável'}</span>
          <span>{projeto || 'Sem projeto'}</span>
        </div>
      )}

      <div className={styles.acoes}>
        {modoKanban && colunaAnterior && (
          <button
            className={styles.btnMover}
            onClick={() => onMover(colunaAnterior)}
            title="Mover para a coluna anterior"
          >
            ←
          </button>
        )}
        {modoKanban && colunaProxima && (
          <button
            className={styles.btnMover}
            onClick={() => onMover(colunaProxima)}
            title="Mover para a próxima coluna"
          >
            →
          </button>
        )}
        <button className={styles.btnDeletar} onClick={onDeletar} title="Excluir tarefa">
          X
        </button>
      </div>
    </li>
  );
}
