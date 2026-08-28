import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ModalTarefa({
  aberto,
  tarefaEditando,
  statusInicial,
  aoFechar,
  aoSalvar,
}) {
  const [texto, setTexto] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [prioridade, setPrioridade] = useState("MEDIA");

  useEffect(() => {
    if (tarefaEditando) {
      setTexto(tarefaEditando.texto);
      setCep(tarefaEditando.cep);
      setCidade(tarefaEditando.cidade);
      setPrioridade(tarefaEditando.prioridade);
    } else {
      setTexto("");
      setCep("");
      setCidade("");
      setPrioridade("MEDIA");
    }
  }, [tarefaEditando, aberto]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") aoFechar();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [aoFechar]);

  const buscarCep = async (meuCep) => {
    setCep(meuCep);
    if (meuCep.length === 8) {
      try {
        const response = await axios.get(
          `https://viacep.com.br/ws/${meuCep}/json/`
        );
        if (response.data.localidade) {
          setCidade(`${response.data.localidade} - ${response.data.uf}`);
        }
      } catch (error) {
        console.error("Erro ao buscar CEP");
      }
    }
  };

  const salvar = () => {
    if (!texto.trim()) return alert("Digite o nome da tarefa!");

    const novaTarefa = {
      id: tarefaEditando ? tarefaEditando.id : Date.now().toString(),
      texto,
      cep,
      cidade,
      prioridade,
      status: tarefaEditando ? tarefaEditando.status : statusInicial,
    };
    aoSalvar(novaTarefa);
    aoFechar();
  };

  if (!aberto) return null;

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginTop: "5px",
    borderRadius: "4px",
    border: "1px solid #323238",
    backgroundColor: "#121214",
    color: "#e1e1e6",
    outline: "none",
  };

  return (
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
      onClick={aoFechar}
    >
      <div
        style={{
          backgroundColor: "#202024",
          padding: "30px",
          borderRadius: "8px",
          width: "400px",
          color: "#fff",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginTop: 0, marginBottom: "20px" }}>
          {tarefaEditando ? "Editar Tarefa" : "Nova Tarefa"}
        </h3>

        <label
          style={{
            display: "block",
            marginTop: "10px",
            fontSize: "14px",
            color: "#c4c4cc",
          }}
        >
          Tarefa:
        </label>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          style={inputStyle}
          placeholder="Ex: Estudar React"
        />

        <label
          style={{
            display: "block",
            marginTop: "15px",
            fontSize: "14px",
            color: "#c4c4cc",
          }}
        >
          CEP (Somente números):
        </label>
        <input
          value={cep}
          onChange={(e) => buscarCep(e.target.value)}
          maxLength={8}
          style={inputStyle}
          placeholder="Ex: 01001000"
        />

        <label
          style={{
            display: "block",
            marginTop: "15px",
            fontSize: "14px",
            color: "#c4c4cc",
          }}
        >
          Cidade/UF:
        </label>
        <input
          value={cidade}
          disabled
          style={{
            ...inputStyle,
            backgroundColor: "#323238",
            color: "#8d8d99",
          }}
          placeholder="Preenchimento automático"
        />

        <label
          style={{
            display: "block",
            marginTop: "15px",
            fontSize: "14px",
            color: "#c4c4cc",
          }}
        >
          Prioridade:
        </label>
        <select
          value={prioridade}
          onChange={(e) => setPrioridade(e.target.value)}
          style={inputStyle}
        >
          <option value="BAIXA">Baixa</option>
          <option value="MEDIA">Média</option>
          <option value="ALTA">Alta</option>
        </select>

        <div style={{ display: "flex", gap: "10px", marginTop: "25px" }}>
          <button
            onClick={salvar}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#00b37e",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Salvar
          </button>
          <button
            onClick={aoFechar}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "transparent",
              border: "1px solid #f75a68",
              color: "#f75a68",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}