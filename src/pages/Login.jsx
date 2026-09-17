import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api"; // Conexão com o backend real
import "../index.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const fazerLogin = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    try {
      // 1. Chamada assíncrona para a API real (POST /auth/login)
      const resposta = await api.post("/auth/login", {
        email, // No backend, ele pode ler "email" ou "usuario", dependendo de como o professor montou
        senha,
      });

      // 2. Extrai o token e os dados do usuário retornados pelo servidor
      const { token, usuario } = resposta.data;

      // 3. Salva no AuthContext e no localStorage
      login(usuario, token);

      // 4. Redireciona para a raiz (onde fica o Kanban)
      navigate("/");
    } catch (err) {
      // Trata mensagens de erro da API (ex: 401 Credenciais inválidas)
      setErro(
        err.response?.data?.erro || "Erro ao conectar com o servidor. Verifique se o backend está ligado!"
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#121214",
      }}
    >
      <form
        onSubmit={fazerLogin}
        style={{
          backgroundColor: "#202024",
          padding: "40px",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          width: "320px",
          border: "1px solid #323238",
          boxShadow: "0px 10px 25px rgba(0,0,0,0.5)",
        }}
      >
        <div>
          <h2 style={{ color: "#00b37e", textAlign: "center", margin: 0, fontSize: "24px" }}>
            TaskFlow
          </h2>
          <p style={{ textAlign: "center", color: "#c4c4cc", fontSize: "14px", marginTop: "6px", marginBottom: 0 }}>
            Faça login para continuar
          </p>
        </div>

        {/* Exibição de mensagem de erro caso ocorra falha no login */}
        {erro && (
          <div
            style={{
              backgroundColor: "#f8717122",
              border: "1px solid #f87171",
              color: "#f87171",
              padding: "10px",
              borderRadius: "6px",
              fontSize: "13px",
              textAlign: "center",
            }}
          >
            {erro}
          </div>
        )}

        {/* Campo de Usuário/E-mail */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <Mail size={18} style={{ position: "absolute", left: "12px", color: "#8d8d99" }} />
          <input
            id="email"
            name="email"
            type="text" /* <-- Alterado para text para aceitar a palavra "admin" */
            placeholder="Usuário ou E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
            style={{
              width: "100%",
              padding: "12px 12px 12px 40px",
              borderRadius: "6px",
              border: "1px solid #323238",
              backgroundColor: "#121214",
              color: "#fff",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Campo de Senha */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <Lock size={18} style={{ position: "absolute", left: "12px", color: "#8d8d99" }} />
          <input
            id="senha"
            name="senha"
            type={mostrarSenha ? "text" : "password"}
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
            required
            style={{
              width: "100%",
              padding: "12px 40px 12px 40px",
              borderRadius: "6px",
              border: "1px solid #323238",
              backgroundColor: "#121214",
              color: "#fff",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <button
            type="button"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            style={{
              position: "absolute",
              right: "12px",
              background: "none",
              border: "none",
              color: "#8d8d99",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: 0,
            }}
          >
            {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Botão de Entrar */}
        <button
          type="submit"
          disabled={carregando}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            padding: "12px",
            backgroundColor: "#00b37e",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: carregando ? "not-allowed" : "pointer",
            fontWeight: "bold",
            fontSize: "15px",
            opacity: carregando ? 0.7 : 1,
          }}
        >
          <LogIn size={18} />
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}