import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const autenticado = localStorage.getItem("autenticado") === "true";

  const fazerLogout = () => {
    localStorage.removeItem("autenticado");
    navigate("/");
  };

  const menuStyle = (path) => ({
    padding: "10px 15px",
    textDecoration: "none",
    color: location.pathname === path ? "#fff" : "#8d8d99",
    backgroundColor: location.pathname === path ? "#323238" : "transparent",
    borderRadius: "4px",
    fontWeight: "bold",
    display: "block",
    marginBottom: "10px",
  });

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#121214",
        color: "#e1e1e6",
        fontFamily: "sans-serif",
      }}
    >
      <aside
        style={{
          width: "220px",
          backgroundColor: "#202024",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ color: "#00b37e", marginBottom: "40px" }}>TaskFlow</h2>

        <nav style={{ flex: 1 }}>
          {autenticado && (
            <Link to="/dashboard" style={menuStyle("/dashboard")}>
              Dashboard
            </Link>
          )}
          <Link to="/sobre" style={menuStyle("/sobre")}>
            Sobre
          </Link>
        </nav>

        {autenticado && (
          <button
            onClick={fazerLogout}
            style={{
              padding: "10px",
              backgroundColor: "transparent",
              color: "#f75a68",
              border: "1px solid #f75a68",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Sair
          </button>
        )}
      </aside>

      <main style={{ flex: 1, padding: "30px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}