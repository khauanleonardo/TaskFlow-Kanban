import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={styles.container}>
      <div style={styles.cenario}>
        <div style={styles.carro} className="carro-animado">
          🏎️💨
        </div>
        <div style={styles.pista} />
      </div>

      <h1 style={styles.titulo}>404</h1>
      <h2 style={styles.subtitulo}>Ops! Você pegou o caminho errado.</h2>
      <p style={styles.texto}>
        A página que você está procurando não existe ou foi movida.
      </p>

      <Link to="/dashboard" style={styles.botao}>
        Voltar para o Dashboard
      </Link>

      <style>{`
        @keyframes dirigir {
          0% {
            transform: translateX(-150px);
          }
          50% {
            transform: translateX(150px);
          }
          50.01% {
            transform: translateX(150px) scaleX(-1);
          }
          100% {
            transform: translateX(-150px) scaleX(-1);
          }
        }

        .carro-animado {
          animation: dirigir 6s ease-in-out infinite;
        }

        a:hover {
          filter: brightness(1.1);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default NotFound;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "80vh",
    color: "#fff",
    fontFamily: "sans-serif",
    textAlign: "center",
    padding: "20px",
  },
  cenario: {
    position: "relative",
    width: "300px",
    height: "80px",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  carro: {
    fontSize: "45px",
    marginBottom: "2px",
    userSelect: "none",
  },
  pista: {
    width: "100%",
    height: "4px",
    backgroundColor: "#323238",
    borderRadius: "2px",
    borderBottom: "2px dashed #00b37e",
  },
  titulo: {
    fontSize: "80px",
    margin: 0,
    color: "#00b37e",
    fontWeight: "bold",
    letterSpacing: "2px",
  },
  subtitulo: {
    fontSize: "22px",
    margin: "10px 0",
    color: "#e1e1e6",
  },
  texto: {
    fontSize: "14px",
    color: "#8d8d99",
    marginBottom: "30px",
  },
  botao: {
    padding: "12px 24px",
    backgroundColor: "#00b37e",
    color: "#fff",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    display: "inline-block",
    transition: "all 0.2s ease",
  },
};