import React, { useState, useEffect } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar'; // Garanta que o caminho para a Sidebar está correto

export default function Kanban() {
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Estados do formulário
  const [novaTarefaTexto, setNovaTarefaTexto] = useState('');
  const [prioridade, setPrioridade] = useState('media');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [buscandoCep, setBuscandoCep] = useState(false);

  // --- CAPÍTULO 7: BUSCAR TAREFAS (GET) ---
  useEffect(() => {
    async function carregarTarefas() {
      try {
        setCarregando(true);
        setErro('');
        const resposta = await api.get('/tarefas');
        setTarefas(resposta.data);
      } catch (e) {
        setErro('Erro ao carregar tarefas. Verifique se o servidor backend está rodando.');
        console.error(e);
      } finally {
        setCarregando(false);
      }
    }

    carregarTarefas();
  }, []);

  // --- BUSCA AUTOMÁTICA DE CEP (ViaCEP) ---
  const handleCepChange = async (e) => {
    const valorCep = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    setCep(valorCep);

    if (valorCep.length === 8) {
      try {
        setBuscandoCep(true);
        const res = await fetch(`https://viacep.com.br/ws/${valorCep}/json/`);
        const data = await res.json();

        if (!data.erro) {
          setEndereco(`${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`);
        } else {
          setEndereco('CEP não encontrado.');
        }
      } catch (err) {
        console.error('Erro ao buscar CEP:', err);
        setEndereco('Erro ao consultar CEP.');
      } finally {
        setBuscandoCep(false);
      }
    } else {
      setEndereco('');
    }
  };

  // --- CAPÍTULO 8: CRIAR TAREFA (POST) ---
  async function handleCriarTarefa(e) {
    e.preventDefault();
    if (!novaTarefaTexto.trim()) return;

    try {
      setErro('');
      const payload = {
        texto: novaTarefaTexto,
        coluna: 'afazer',
        prioridade: prioridade,
        cep: cep,
        endereco: endereco
      };

      const resposta = await api.post('/tarefas', payload);

      setTarefas((prev) => [...prev, resposta.data]);
      setNovaTarefaTexto('');
      setCep('');
      setEndereco('');
      setPrioridade('media');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.erros?.join(', ') || err.response?.data?.erro || 'Erro ao criar tarefa.';
      setErro(`Não foi possível criar: ${msg}`);
    }
  }

  // --- CAPÍTULO 8: DELETAR TAREFA (DELETE) ---
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

  // --- CAPÍTULO 8: MOVER TAREFA (PUT) ---
  async function handleMoverTarefa(id, novaColuna) {
    try {
      setErro('');
      const tarefaAtual = tarefas.find((t) => t.id === id);
      if (!tarefaAtual) return;

      const payload = {
        ...tarefaAtual,
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

  // Formatação legível da coluna
  const formatarNomeColuna = (col) => {
    if (col === 'afazer') return 'A Fazer';
    if (col === 'andamento') return 'Em Andamento';
    if (col === 'concluido') return 'Concluído';
    return col || 'A Fazer';
  };

  // Cores de destaque para prioridade
  const getCorPrioridade = (p) => {
    switch (p) {
      case 'alta': return { bg: '#f8717122', cor: '#f87171', texto: 'Alta' };
      case 'media': return { bg: '#fba94c22', cor: '#fba94c', texto: 'Média' };
      case 'baixa': return { bg: '#00b37e22', cor: '#00b37e', texto: 'Baixa' };
      default: return { bg: '#323238', cor: '#8d8d99', texto: 'Normal' };
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121214' }}>
      {/* Componente Sidebar na lateral esquerda */}
      <Sidebar />

      {/* Área Principal do Quadro Kanban */}
      <main style={{ flex: 1, padding: '30px', color: '#fff', overflowY: 'auto' }}>
        <h1 style={{ color: '#00b37e', marginBottom: '20px' }}>Quadro Kanban</h1>

        {erro && (
          <div style={{ padding: '10px', backgroundColor: '#f8717122', border: '1px solid #f87171', color: '#f87171', borderRadius: '6px', marginBottom: '20px' }}>
            {erro}
          </div>
        )}

        {/* Formulário para Adicionar Tarefa com CEP e Prioridade */}
        <form onSubmit={handleCriarTarefa} style={{ backgroundColor: '#202024', padding: '20px', borderRadius: '8px', border: '1px solid #323238', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '18px', color: '#e1e1e6', marginBottom: '15px' }}>Nova Tarefa</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Campo Título/Texto */}
            <div>
              <label htmlFor="novaTarefaTexto" style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#c4c4cc' }}>
                Descrição da Tarefa *
              </label>
              <input
                id="novaTarefaTexto"
                name="novaTarefaTexto"
                type="text"
                placeholder="Ex: Refatorar rotas da API..."
                value={novaTarefaTexto}
                onChange={(e) => setNovaTarefaTexto(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #323238', backgroundColor: '#121214', color: '#fff', outline: 'none' }}
              />
            </div>

            {/* Linha dupla: CEP e Prioridade */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {/* Campo CEP */}
              <div>
                <label htmlFor="cep" style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#c4c4cc' }}>
                  CEP da Localidade
                </label>
                <input
                  id="cep"
                  name="cep"
                  type="text"
                  maxLength="8"
                  placeholder="Apenas números (Ex: 01001000)"
                  value={cep}
                  onChange={handleCepChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #323238', backgroundColor: '#121214', color: '#fff', outline: 'none' }}
                />
                {buscandoCep && <span style={{ fontSize: '12px', color: '#8d8d99' }}>Buscando endereço...</span>}
                {endereco && <span style={{ fontSize: '12px', color: '#00b37e', display: 'block', marginTop: '4px' }}>{endereco}</span>}
              </div>

              {/* Seletor de Prioridade */}
              <div>
                <label htmlFor="prioridade" style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#c4c4cc' }}>
                  Prioridade
                </label>
                <select
                  id="prioridade"
                  name="prioridade"
                  value={prioridade}
                  onChange={(e) => setPrioridade(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #323238', backgroundColor: '#121214', color: '#fff', outline: 'none' }}
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              style={{
                alignSelf: 'flex-start',
                padding: '12px 24px',
                backgroundColor: '#00b37e',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Adicionar Tarefa
            </button>
          </div>
        </form>

        {/* Lista de Cards de Tarefas */}
        {carregando ? (
          <p style={{ color: '#8d8d99' }}>Carregando tarefas...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
            {tarefas.length === 0 ? (
              <p style={{ color: '#8d8d99' }}>Nenhuma tarefa encontrada.</p>
            ) : (
              tarefas.map((tarefa) => {
                const badgePrioridade = getCorPrioridade(tarefa.prioridade);

                return (
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
                      {/* Tags de Estado e Prioridade */}
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '11px', color: '#8d8d99', backgroundColor: '#121214', padding: '3px 8px', borderRadius: '4px' }}>
                          {formatarNomeColuna(tarefa.coluna)}
                        </span>
                        <span style={{ fontSize: '11px', color: badgePrioridade.cor, backgroundColor: badgePrioridade.bg, padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                          {badgePrioridade.texto}
                        </span>
                      </div>

                      {/* Descrição */}
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#e1e1e6' }}>
                        {tarefa.texto || tarefa.titulo}
                      </h3>

                      {/* Informações de Endereço/CEP se houver */}
                      {(tarefa.endereco || tarefa.cep) && (
                        <p style={{ fontSize: '12px', color: '#8d8d99', margin: '6px 0 0 0' }}>
                          📍 {tarefa.endereco || `CEP: ${tarefa.cep}`}
                        </p>
                      )}
                    </div>

                    {/* Botões de Ação */}
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
                );
              })
            )}
          </div>
        )}
      </main>
    </div>
  );
}