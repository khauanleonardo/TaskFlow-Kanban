import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

export default function Login() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erroAnimacao, setErroAnimacao] = useState(false);

  const fazerLogin = (e) => {
    e.preventDefault();
    if (usuario === "admin" && senha === "1234") {
      localStorage.setItem("autenticado", "true");
      navigate("/dashboard");
    } else {
      setErroAnimacao(true);
      setTimeout(() => setErroAnimacao(false), 500); 
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
        className={erroAnimacao ? "shake" : ""}
        style={{
          backgroundColor: "#202024",
          padding: "40px",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          width: "300px",
          border: erroAnimacao ? "1px solid #f75a68" : "none",
        }}
      >
        <h2 style={{ color: "#00b37e", textAlign: "center", margin: 0 }}>
          TaskFlow
        </h2>

        {erroAnimacao ? (
          <p style={{ textAlign: "center", color: "#f75a68", fontSize: "14px" }}>
            Credenciais incorretas!
          </p>
        ) : (
          <p style={{ textAlign: "center", color: "#c4c4cc", fontSize: "14px" }}>
            Faça login para continuar
          </p>
        )}

        <input
          type="text"
          placeholder="Usuário "
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "4px",
            border: "none",
            backgroundColor: "#121214",
            color: "#fff",
          }}
        />
        <input
          type="password"
          placeholder="Senha "
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "4px",
            border: "none",
            backgroundColor: "#121214",
            color: "#fff",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#00b37e",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}