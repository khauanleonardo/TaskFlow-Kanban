import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sobre from "./pages/Sobre";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

const RotaProtegida = ({ children }) => {
  const autenticado = localStorage.getItem("autenticado") === "true";
  return autenticado ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <RotaProtegida>
              <Layout>
                <Dashboard />
              </Layout>
            </RotaProtegida>
          }
        />

        <Route
          path="/sobre"
          element={
            <Layout>
              <Sobre />
            </Layout>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}