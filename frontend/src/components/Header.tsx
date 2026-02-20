import logo from "../assets/logo.svg";
import { useHealthQuery } from "../hooks";
import { Avatar, Badge, Layout, Space, Spin, Typography } from "antd";
import "./Header.css";

export default function Header() {
  const { status, data, error } = useHealthQuery();

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
    <Layout.Header className="app-header">
      <Space align="center" size="middle">
        <Avatar size={64} src={logo} shape="square" />
        <div>
          <Typography.Title level={4} className="app-header-title">
            Task Manager
          </Typography.Title>
          <Typography.Text type="secondary">
            Organize your tasks with ease
          </Typography.Text>
        </div>
      </Space>
      <Space align="center" size="small" aria-live="polite">
        {health === "loading" ? (
          <Spin size="small" />
        ) : (
          <Badge status={badgeStatus} />
        )}
        <Typography.Text>{healthLabel}</Typography.Text>
      </Space>
    </Layout.Header>
  );
}
