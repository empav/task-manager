import "antd/dist/reset.css";
import "./App.css";
import Header from "./components/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Main from "./components/Main";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider, Layout, theme } from "antd";

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <QueryClientProvider client={queryClient}>
      <Layout className="app-layout">
        <Header />
        <Main />
      </Layout>
      </QueryClientProvider>
    </ConfigProvider>
  </StrictMode>,
);
