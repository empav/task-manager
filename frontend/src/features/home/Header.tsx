import logo from "../../assets/logo.svg";
import { useHealthQuery } from "../../hooks";
import { Avatar, Badge, Button, Layout, Space, Spin, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/auth";

import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const { status, data, error } = useHealthQuery();

  const isAuthenticated = Boolean(sessionStorage.getItem("auth_token"));

  const onLogout = async () => {
    await logout();
    sessionStorage.removeItem("auth_token");
    navigate("/login", { replace: true });
  };

  const health =
    status === "pending"
      ? "loading"
      : data
        ? "ok"
        : error
          ? "error"
          : "unknown";

  const badgeStatus =
    health === "loading" ? "processing" : health === "ok" ? "success" : "error";

  const healthLabel =
    health === "loading"
      ? "Checking..."
      : health === "ok"
        ? "Backend online"
        : "Backend offline";

  return (
    <Layout.Header className="header-content">
      <Space align="center" size="middle">
        <Avatar size={64} src={logo} shape="square" />
        <div>
          <Typography.Title level={4} className="header-title">
            Task Manager
          </Typography.Title>
          <Typography.Text type="secondary">
            Organize your tasks with ease
          </Typography.Text>
        </div>
      </Space>
      <Space align="center" size="middle">
        {health === "loading" ? (
          <Spin size="small" />
        ) : (
          <Badge status={badgeStatus} />
        )}
        <Typography.Text>{healthLabel}</Typography.Text>
        {isAuthenticated && (
          <Button variant="outlined" onClick={onLogout}>
            Logout
          </Button>
        )}
      </Space>
    </Layout.Header>
  );
}
