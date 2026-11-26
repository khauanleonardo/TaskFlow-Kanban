import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Kanban from './kanban';
import { AuthProvider } from '../contexts/AuthContext';
import api from '../api';

// Troca o api.js inteiro por um de mentira
vi.mock('../api', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
  mensagensDeErro: vi.fn(() => ['erro']),
}));

// O que a API de mentira responde em cada endereço
const respostas = {
  '/prioridades': [
    { id: 1, descricao: 'Alto' },
    { id: 2, descricao: 'Médio' },
  ],
  '/tarefas': [
    {
      id: 1,
      texto: 'Modelar o banco',
      coluna: 'afazer',
      prioridade: 'Alto',
      prioridade_cor: '#EF4444',
      usuario_id: 1,
      projeto_id: 10,
    },
    {
      id: 2,
      texto: 'Criar a API',
      coluna: 'andamento',
      prioridade: 'Médio',
      prioridade_cor: '#F59E0B',
      usuario_id: 1,
      projeto_id: 10,
    },
  ],
  '/usuarios': [{ id: 1, nome: 'Ana Lima' }],
  '/projetos': [{ id: 10, nome: 'TaskFlow' }],
};

function desenharKanban() {
  render(
    <AuthProvider>
      <Kanban />
    </AuthProvider>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  api.get.mockImplementation((url) => Promise.resolve({ data: respostas[url] }));
});

describe('Kanban', () => {
  test('mostra Carregando enquanto a API não responde', () => {
    api.get.mockImplementation(() => new Promise(() => {}));
    desenharKanban();
    expect(screen.getByText('Carregando tarefas...')).toBeInTheDocument();
  });

  test('depois da resposta, as tarefas aparecem', async () => {
    desenharKanban();

    expect(await screen.findByText('Modelar o banco')).toBeInTheDocument();
    expect(screen.getByText('Criar a API')).toBeInTheDocument();
    expect(screen.queryByText('Carregando tarefas...')).not.toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith('/tarefas');
  });

  test('se a API falha, mostra a mensagem de erro', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    api.get.mockRejectedValue(new Error('Network Error'));

    desenharKanban();

    expect(
      await screen.findByText('Erro ao carregar tarefas. Verifique a conexao.')
    ).toBeInTheDocument();
  });

  test('criar: o + abre o modal e a tarefa aparece', async () => {
    const user = userEvent.setup();
    api.post.mockResolvedValue({
      data: {
        id: 3,
        texto: 'Testar o Kanban',
        coluna: 'afazer',
        prioridade: 'Médio',
        prioridade_cor: '#F59E0B',
        usuario_id: 1,
        projeto_id: 10,
      },
    });

    desenharKanban();

    await user.click(await screen.findByTitle('Nova tarefa em A Fazer'));
    await user.type(screen.getByLabelText('Tarefa'), 'Testar o Kanban');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(api.post).toHaveBeenCalledWith(
      '/tarefas',
      expect.objectContaining({
        texto: 'Testar o Kanban',
        coluna: 'afazer',
      })
    );
    expect(await screen.findByText('Testar o Kanban')).toBeInTheDocument();
  });

  // Exercício 4
  test('clicar em excluir da primeira tarefa chama api.delete com "/tarefas/1" e a tarefa some', async () => {
    const user = userEvent.setup();
    api.delete.mockResolvedValue({ data: {} });

    desenharKanban();

    await screen.findByText('Modelar o banco');
    const botoesExcluir = screen.getAllByTitle('Excluir tarefa');
    await user.click(botoesExcluir[0]);
    await user.click(screen.getByRole('button', { name: 'Sim, Excluir' }));

    expect(api.delete).toHaveBeenCalledWith('/tarefas/1');
    expect(screen.queryByText('Modelar o banco')).not.toBeInTheDocument();
  });

  // Exercício 5 (Desafio)
  test('clicar na seta de avançar de Modelar o banco chama api.put com a coluna andamento', async () => {
    const user = userEvent.setup();
    api.put.mockResolvedValue({ data: {} });

    desenharKanban();

    await screen.findByText('Modelar o banco');
    const botoesAvancar = screen.getAllByTitle('Avançar para próxima coluna');
    await user.click(botoesAvancar[0]);

    expect(api.put).toHaveBeenCalledWith(
      '/tarefas/1',
      expect.objectContaining({
        coluna: 'andamento',
      })
    );
  });
});
