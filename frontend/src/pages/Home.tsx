import { Layout, Typography } from "antd";
import Header from "../components/Header";
import "./Home.css";

export default function Home() {
  return (
    <Layout.Content className="home-content">
      <Header />
      <Typography.Text type="secondary">Home</Typography.Text>
    </Layout.Content>
  );
}
