import { Layout } from "antd";
import Header from "./Header";
import Title from "./Title";
import "./Home.css";

export default function Home() {
  return (
    <Layout.Content className="home-content">
      <Header />
      <div className="home-main">
        <Title />
      </div>
    </Layout.Content>
  );
}
