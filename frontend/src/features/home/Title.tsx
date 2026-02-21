import { Button, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { countTasks, createTask } from "../../api";
import type { ApiError, TaskCreate } from "../../types";
import CreateTaskModal from "./CreateTaskModal";
import "./Title.css";

type TitleProps = {
  onTaskCreated?: () => void;
};

export default function Title({ onTaskCreated = () => {} }: TitleProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [taskCount, setTaskCount] = useState<number | null>(null);

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
          setTaskCount(null);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const onCreate = async (values: TaskCreate) => {
    try {
      setIsLoading(true);
      await createTask(values);
      message.success("Task created");
      setIsCreateModalOpen(false);
      onTaskCreated();
    } catch (err) {
      const error = err as ApiError;
      message.error(
        error?.message?.join(", ") ?? "An unexpected error occurred.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {taskCount === 0 ? (
        <>
          <Typography.Title level={4} className="title-content">
            Start here creating a new task
            <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
              Create task
            </Button>
          </Typography.Title>
        </>
      ) : null}
      <CreateTaskModal
        open={isCreateModalOpen}
        isLoading={isLoading}
        onCancel={() => setIsCreateModalOpen(false)}
        onCreate={onCreate}
      />
    </>
  );
}
