import React, { useState, useEffect } from "react";
import axios from "axios";

const URL_API = "https://6a88452a7b483fa21fe8dd23.mockapi.io/tarefas";

export default function Dashboard() {
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Controle do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [statusColuna, setStatusColuna] = useState("A FAZER");

  // Campos do Formulário
  const [titulo, setTitulo] = useState("");
  const [cep, setCep] = useState("");
  const [cidadeUf, setCidadeUf] = useState("");
  const [prioridade, setPrioridade] = useState("Alta");

  // GET: Buscar tarefas da API e padronizar os dados do MockAPI
  useEffect(() => {
    async function carregarTarefas() {
      try {
        setCarregando(true);
        setErro("");
        const resposta = await axios.get(URL_API);

        // Padroniza itens antigos/gerados pelo MockAPI
        const tarefasTratadas = resposta.data.map((item) => {
          let st = item.status ? String(item.status).toUpperCase() : "A FAZER";
          if (st !== "A FAZER" && st !== "EM ANDAMENTO" && st !== "CONCLUÍDO") {
            st = "A FAZER";
          }

          return {
            id: String(item.id),
            titulo: item.titulo || item.name || item.texto || "Tarefa sem título",
            cidadeUf: item.cidadeUf || item.cidade || "Não informada",
            prioridade: ["Baixa", "Média", "Alta"].includes(item.prioridade)
              ? item.prioridade
              : "Média",
            status: st,
          };
        });

        setTarefas(tarefasTratadas);
      } catch (e) {
        setErro("Erro ao carregar tarefas. Verifique a conexão.");
        console.error(e);
      } finally {
        setCarregando(false);
      }
    }
    carregarTarefas();
  }, []);

  const getCorPrioridade = (pri) => {
    if (pri === "Baixa") return "#00b37e";
    if (pri === "Média") return "#eba417";
    if (pri === "Alta") return "#f75a68";
    return "#8d8d99";
  };

  const abrirModal = (coluna) => {
    setStatusColuna(coluna);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setTitulo("");
    setCep("");
    setCidadeUf("");
  };

  const buscarCep = async (e) => {
    const valorCep = e.target.value.replace(/\D/g, "");
    if (valorCep.length === 8) {
      try {
        const res = await axios.get(
          `https://viacep.com.br/ws/${valorCep}/json/`
        );
        if (!res.data.erro) {
          setCidadeUf(`${res.data.localidade} - ${res.data.uf}`);
        } else {
          alert("CEP não encontrado!");
        }
      } catch (error) {
        alert("Erro ao buscar o CEP!");
      }
    }
  };

  // POST: Criar nova tarefa no MockAPI
  const adicionarTarefa = async (e) => {
    e.preventDefault();
    if (!titulo || !cidadeUf) {
      alert("Preencha o título e o CEP corretamente.");
      return;
    }

    try {
      const novaTarefaDados = {
        titulo,
        cidadeUf,
        prioridade,
        status: statusColuna,
      };

      const resposta = await axios.post(URL_API, novaTarefaDados);
      setTarefas((tarefasAntigas) => [...tarefasAntigas, resposta.data]);
      fecharModal();
    } catch (e) {
      alert("Erro ao salvar a tarefa no servidor.");
      console.error(e);
    }
  };

  // PUT / PATCH: Atualizar o status da tarefa no MockAPI
  const moverTarefa = async (id, proximoStatus) => {
    try {
      await axios.put(`${URL_API}/${id}`, {
        status: proximoStatus,
      });

      setTarefas((tarefasAntigas) =>
        tarefasAntigas.map((t) =>
          t.id === id ? { ...t, status: proximoStatus } : t
        )
      );
    } catch (e) {
      alert("Erro ao mover a tarefa.");
      console.error(e);
    }
  };

  // DELETE: Remover tarefa no MockAPI
  const removerTarefa = async (id) => {
    try {
      await axios.delete(`${URL_API}/${id}`);
      setTarefas((tarefasAntigas) => tarefasAntigas.filter((t) => t.id !== id));
    } catch (e) {
      alert("Erro ao deletar a tarefa.");
      console.error(e);
    }
  };

  const total = tarefas.length;
  const pendentes = tarefas.filter((t) => t.status !== "CONCLUÍDO").length;
  const concluidas = tarefas.filter((t) => t.status === "CONCLUÍDO").length;

  return (
    <div style={{ color: "#fff", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Cabeçalho */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <div>
          <h1 style={{ color: "#00b37e", margin: 0 }}>TaskFlow</h1>
          <p style={{ color: "#8d8d99", margin: 0 }}>Gerencie suas tarefas</p>
        </div>
        <div style={{ fontSize: "14px", fontWeight: "bold" }}>
          <span style={{ color: "#8d8d99", marginRight: "15px" }}>
            {total} tarefas
          </span>
          <span style={{ color: "#eba417", marginRight: "15px" }}>
            {pendentes} pendentes
          </span>
          <span style={{ color: "#00b37e" }}>{concluidas} concluídas</span>
        </div>
      </div>

      {carregando && (
        <p style={{ textAlign: "center", color: "#8d8d99" }}>
          Carregando tarefas...
        </p>
      )}

      {erro && <p style={{ textAlign: "center", color: "#f75a68" }}>{erro}</p>}

      {/* QUADRO KANBAN */}
      {!carregando && !erro && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "20px",
          }}
        >
          {["A FAZER", "EM ANDAMENTO", "CONCLUÍDO"].map((coluna) => {
            const tarefasColuna = tarefas.filter((t) => t.status === coluna);

            return (
              <div
                key={coluna}
                style={{
                  backgroundColor: "#202024",
                  padding: "15px",
                  borderRadius: "8px",
                  minHeight: "400px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "15px",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  <span>{coluna}</span>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "#323238",
                        padding: "2px 8px",
                        borderRadius: "10px",
                      }}
                    >
                      {tarefasColuna.length}
                    </span>
                    <button
                      onClick={() => abrirModal(coluna)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#fff",
                        fontSize: "18px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {tarefasColuna.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      backgroundColor: "#29292e",
                      padding: "15px",
                      borderRadius: "6px",
                      borderLeft: `4px solid ${getCorPrioridade(t.prioridade)}`,
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong style={{ display: "block" }}>{t.titulo}</strong>
                      <span style={{ fontSize: "12px", color: "#8d8d99" }}>
                        {t.cidadeUf}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          color: getCorPrioridade(t.prioridade),
                          fontSize: "11px",
                          fontWeight: "bold",
                          marginRight: "5px",
                        }}
                      >
                        {t.prioridade.toUpperCase()}
                      </span>

                      {coluna === "A FAZER" && (
                        <button
                          onClick={() => moverTarefa(t.id, "EM ANDAMENTO")}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#8d8d99",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          →
                        </button>
                      )}
                      {coluna === "EM ANDAMENTO" && (
                        <>
                          <button
                            onClick={() => moverTarefa(t.id, "A FAZER")}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#8d8d99",
                              cursor: "pointer",
                              fontSize: "16px",
                              fontWeight: "bold",
                            }}
                          >
                            ←
                          </button>
                          <button
                            onClick={() => moverTarefa(t.id, "CONCLUÍDO")}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#8d8d99",
                              cursor: "pointer",
                              fontSize: "16px",
                              fontWeight: "bold",
                            }}
                          >
                            →
                          </button>
                        </>
                      )}
                      {coluna === "CONCLUÍDO" && (
                        <button
                          onClick={() => moverTarefa(t.id, "EM ANDAMENTO")}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#8d8d99",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          ←
                        </button>
                      )}

                      <button
                        onClick={() => removerTarefa(t.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#f75a68",
                          cursor: "pointer",
                          marginLeft: "5px",
                          fontWeight: "bold",
                        }}
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL POP-UP (NOVA TAREFA) */}
      {modalAberto && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#202024",
              padding: "25px",
              borderRadius: "8px",
              width: "400px",
              border: "1px solid #323238",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#00b37e" }}>
              Nova Tarefa - {statusColuna}
            </h3>

            <form
              onSubmit={adicionarTarefa}
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    color: "#c4c4cc",
                    fontSize: "14px",
                  }}
                >
                  Título da Tarefa:
                </label>
                <input
                  type="text"
                  placeholder="Digite o título..."
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #323238",
                    backgroundColor: "#121214",
                    color: "#fff",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    color: "#c4c4cc",
                    fontSize: "14px",
                  }}
                >
                  CEP (Somente números):
                </label>
                <input
                  type="text"
                  placeholder="Ex: 59000000"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  onBlur={buscarCep}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #323238",
                    backgroundColor: "#121214",
                    color: "#fff",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    color: "#c4c4cc",
                    fontSize: "14px",
                  }}
                >
                  Cidade/UF:
                </label>
                <input
                  type="text"
                  placeholder="Preenchido automaticamente"
                  value={cidadeUf}
                  readOnly
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #323238",
                    backgroundColor: "#29292e",
                    color: "#8d8d99",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    color: "#c4c4cc",
                    fontSize: "14px",
                  }}
                >
                  Prioridade:
                </label>
                <select
                  value={prioridade}
                  onChange={(e) => setPrioridade(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #323238",
                    backgroundColor: "#121214",
                    color: "#fff",
                    outline: "none",
                    cursor: "pointer",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="Baixa" style={{ backgroundColor: "#202024" }}>
                    🟢 Baixa
                  </option>
                  <option value="Média" style={{ backgroundColor: "#202024" }}>
                    🟡 Média
                  </option>
                  <option value="Alta" style={{ backgroundColor: "#202024" }}>
                    🔴 Alta
                  </option>
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={fecharModal}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "transparent",
                    color: "#8d8d99",
                    border: "1px solid #323238",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#00b37e",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Adicionar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}