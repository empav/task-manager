import { Layout } from "antd";
import Header from "./Header";
import TaskTable from "./TaskTable";
import Title from "./Title";
import "./Home.css";
import { useCountTasksQuery } from "../../hooks";

export default function Home() {
  const { data: taskCount = 0, isLoading } = useCountTasksQuery();

  return (
    <Layout.Content className="home-content">
      {!isLoading ? (
        <>
          <Header />
          <Layout.Content className="home-main">
            {taskCount === 0 ? <Title taskCount={taskCount} /> : <TaskTable />}
          </Layout.Content>
        </>
      ) : null}
    </Layout.Content>
  );
}
