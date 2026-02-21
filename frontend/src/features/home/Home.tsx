import { Layout } from "antd";
import Header from "./Header";
import Title from "./Title";
import "./Home.css";
import { useCountTasksQuery } from "../../hooks";

export default function Home() {
  const { data: taskCount = 0, isLoading } = useCountTasksQuery();

  return (
    <Layout.Content className="home-content">
      <Header />
      <div className="home-main">
        {!isLoading && taskCount === 0 ? <Title taskCount={taskCount} /> : null}
      </div>
    </Layout.Content>
  );
}
