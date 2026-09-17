import React, { useState, useEffect } from 'react';
import api from '../api';

export default function Kanban() {
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [novaTarefaTexto, setNovaTarefaTexto] = useState('');

  // Busca inicial de tarefas (GET /tarefas)
  useEffect(() => {
    async function carregarTarefas() {
      try {
        setCarregando(true);
        setErro('');
        const resposta = await api.get('/tarefas');
        setTarefas(resposta.data);
      } catch (e) {
        setErro('Erro ao carregar tarefas. Verifique se o backend está rodando e se você está autenticado.');
        console.error(e);
      } finally {
        setCarregando(false);
      }
    }

    carregarTarefas();
  }, []);

  // Criar nova tarefa (POST /tarefas)
  async function handleCriarTarefa(e) {
    e.preventDefault();
    if (!novaTarefaTexto.trim()) return;

    try {
      setErro('');
      const resposta = await api.post('/tarefas', {
        texto: novaTarefaTexto,
        coluna: 'afazer'
      });

      setTarefas((prev) => [...prev, resposta.data]);
      setNovaTarefaTexto('');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.erros?.join(', ') || err.response?.data?.erro || 'Erro ao criar tarefa.';
      setErro(`Não foi possível criar: ${msg}`);
    }
  }

  // Deletar tarefa (DELETE /tarefas/:id)
  async function handleDeletarTarefa(id) {
    try {
      setErro('');
      await api.delete(`/tarefas/${id}`);
      setTarefas((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      setErro('Erro ao deletar tarefa.');
    }
  }

  // Mover tarefa (PUT /tarefas/:id)
  async function handleMoverTarefa(id, novaColuna) {
    try {
      setErro('');
      const tarefaAtual = tarefas.find((t) => t.id === id);
      if (!tarefaAtual) return;

      const payload = {
        texto: tarefaAtual.texto || tarefaAtual.titulo || 'Sem título',
        coluna: novaColuna
      };

      const resposta = await api.put(`/tarefas/${id}`, payload);

      setTarefas((prev) =>
        prev.map((t) => (t.id === id ? (resposta.data || { ...tarefaAtual, ...payload }) : t))
      );
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.erros?.join(', ') || err.response?.data?.erro || 'Erro ao mover tarefa.';
      setErro(`Não foi possível mover: ${msg}`);
    }
  }

  // Helper para exibir o nome da coluna legível no layout
  const formatarNomeColuna = (col) => {
    if (col === 'afazer') return 'A Fazer';
    if (col === 'andamento') return 'Em Andamento';
    if (col === 'concluido') return 'Concluído';
    return col || 'A Fazer';
  };

  if (carregando) {
    return (
      <div style={{ color: '#fff', padding: '40px', textAlign: 'center' }}>
        Carregando tarefas...
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', color: '#fff', backgroundColor: '#121214', minHeight: '100vh' }}>
      <h1 style={{ color: '#00b37e', marginBottom: '20px' }}>Quadro Kanban</h1>

      {erro && (
        <div style={{ padding: '10px', backgroundColor: '#f8717122', border: '1px solid #f87171', color: '#f87171', borderRadius: '6px', marginBottom: '20px' }}>
          {erro}
        </div>
      )}

      {/* Formulário para adicionar tarefa */}
      <form onSubmit={handleCriarTarefa} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input
          id="novaTarefaTexto"
          name="novaTarefaTexto"
          type="text"
          placeholder="Digite o título da nova tarefa..."
          value={novaTarefaTexto}
          onChange={(e) => setNovaTarefaTexto(e.target.value)}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #323238',
            backgroundColor: '#202024',
            color: '#fff',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '12px 20px',
            backgroundColor: '#00b37e',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Adicionar
        </button>
      </form>

      {/* Lista de Cards de Tarefas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
        {tarefas.length === 0 ? (
          <p style={{ color: '#8d8d99' }}>Nenhuma tarefa encontrada.</p>
        ) : (
          tarefas.map((tarefa) => (
            <div
              key={tarefa.id}
              style={{
                backgroundColor: '#202024',
                border: '1px solid #323238',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#e1e1e6' }}>
                  {tarefa.texto || tarefa.titulo}
                </h3>
                <span style={{ fontSize: '12px', color: '#8d8d99', backgroundColor: '#121214', padding: '4px 8px', borderRadius: '4px' }}>
                  {formatarNomeColuna(tarefa.coluna)}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                {tarefa.coluna !== 'concluido' && (
                  <button
                    onClick={() => handleMoverTarefa(tarefa.id, 'concluido')}
                    style={{ background: 'none', border: '1px solid #00b37e', color: '#00b37e', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Concluir
                  </button>
                )}
                <button
                  onClick={() => handleDeletarTarefa(tarefa.id)}
                  style={{ background: 'none', border: '1px solid #f87171', color: '#f87171', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}