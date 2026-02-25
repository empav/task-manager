import type { ReactNode } from "react";
import { Layout } from "antd";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./features/login/Login";
import Home from "./features/home/Home";

import "./App.css";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = sessionStorage.getItem("auth_token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Layout className="app-layout">
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Layout>
  );
}
