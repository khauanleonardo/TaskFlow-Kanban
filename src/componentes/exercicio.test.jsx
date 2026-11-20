// Exercício do Dia 7
import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TarefaItem from './TarefaItem';
import ListaTarefas from './ListaTarefa';

// Três tarefas no formato que a API devolve
function tarefasExemplo() {
  return [
    { id: 1, texto: 'Modelar o banco', prioridade: 'Alto',
      prioridade_cor: '#EF4444', usuario: 'Ana Lima', projeto: 'TaskFlow' },
    { id: 2, texto: 'Criar a API', prioridade: 'Médio',
      prioridade_cor: '#F59E0B', usuario: 'Bruno Melo', projeto: 'TaskFlow' },
    { id: 3, texto: 'Testar o front', prioridade: 'Baixo',
      prioridade_cor: '#22C55E', usuario: null, projeto: null },
  ];
}

describe('Exercício · TarefaItem na última coluna', () => {
  // 1
  test('na última coluna, mostra a ← e não mostra a →', () => {
    render(
      <TarefaItem
        texto="Estudar Vitest"
        onMover={vi.fn()}
        colunaAnterior="andamento"
      />
    );
    expect(screen.getByRole('button', { name: '←' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '→' })).not.toBeInTheDocument();
  });

  // 2
  test('clicar na ← chama o onMover com "andamento"', async () => {
    const user = userEvent.setup();
    const onMover = vi.fn();
    render(
      <TarefaItem
        texto="Estudar Vitest"
        onMover={onMover}
        colunaAnterior="andamento"
      />
    );
    await user.click(screen.getByRole('button', { name: '←' }));
    expect(onMover).toHaveBeenCalledTimes(1);
    expect(onMover).toHaveBeenCalledWith('andamento');
  });
});

describe('Exercício · ListaTarefas', () => {
  // 3
  test('o projeto "TaskFlow" aparece 2 vezes', () => {
    render(<ListaTarefas tarefas={tarefasExemplo()} onDeletar={vi.fn()} />);
    expect(screen.getAllByText('TaskFlow')).toHaveLength(2);
  });

  // 4
  test('a tarefa sem projeto mostra "Sem projeto"', () => {
    render(<ListaTarefas tarefas={tarefasExemplo()} onDeletar={vi.fn()} />);
    expect(screen.getByText('Sem projeto')).toBeInTheDocument();
  });

  // 5
  test('no Kanban, a → da primeira tarefa chama onMover(1, "andamento")', async () => {
    const user = userEvent.setup();
    const onMover = vi.fn();
    render(
      <ListaTarefas
        tarefas={tarefasExemplo()}
        onDeletar={vi.fn()}
        onMover={onMover}
        colunaProxima="andamento"
      />
    );
    const setas = screen.getAllByRole('button', { name: '→' });
    await user.click(setas[0]);
    expect(onMover).toHaveBeenCalledTimes(1);
    expect(onMover).toHaveBeenCalledWith(1, 'andamento');
  });
});
