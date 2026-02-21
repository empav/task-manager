import { Layout } from "antd";
import Header from "./Header";
import Title from "./Title";
import "./Home.css";
import { useEffect, useState } from "react";
import { countTasks } from "../../api";

export default function Home() {
  const [taskCount, setTaskCount] = useState<number>(0);

  useEffect(() => {
    let active = true;
    countTasks()
      .then((count) => {
        if (active) {
          setTaskCount(count);
        }
      })
      .catch(() => {
        if (active) {
          setTaskCount(0);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <Layout.Content className="home-content">
      <Header />
      <div className="home-main">
        <Title taskCount={taskCount} />
      </div>
    </Layout.Content>
  );
}
