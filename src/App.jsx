import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

// Importando da pasta "components" com os nomes exatos
import RotaPrivada from "./components/RotaPrivada";
import Sidebar from "./components/Sidebar";

import Login from "./pages/login";
import Kanban from "./pages/kanban";

export default function App() {
  const { token, carregando } = useAuth();

  if (carregando) {
    return (
      <div style={{ color: "#fff", padding: "40px", textAlign: "center" }}>
        Carregando sessão...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#121214" }}>
      {token && <Sidebar />}
      <main style={{ flex: 1, marginLeft: token ? "220px" : "0px", width: "100%" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <RotaPrivada>
                <Kanban />
              </RotaPrivada>
            }
          />
        </Routes>
      </main>
    </div>
  );
}