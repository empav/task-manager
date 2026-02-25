import { Layout } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import TaskTable from "./TaskTable";
import Title from "./Title";
import Metrics from "./Metrics";
import "./Home.css";
import { useCountTasksQuery } from "../../hooks";

export default function Home() {
  const { data: taskCount = 0, isLoading } = useCountTasksQuery();
  const navigate = useNavigate();

  useEffect(() => {
    // Making sure that if the user tries to access /home without a token, they are redirected to /login
    const token = sessionStorage.getItem("auth_token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <Layout.Content className="home-content">
      {!isLoading ? (
        <>
          <Header />
          <Layout.Content className="home-main">
            {taskCount === 0 ? (
              <Title taskCount={taskCount} />
            ) : (
              <>
                <Metrics />
                <TaskTable />
              </>
            )}
          </Layout.Content>
        </>
      ) : null}
    </Layout.Content>
  );
}
