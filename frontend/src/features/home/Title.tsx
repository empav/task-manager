import { Button, Typography, message } from "antd";
import { createTask } from "../../api";
import type { ApiError, TaskCreate } from "../../types";
import CreateTaskModal from "./CreateTaskModal";
import "./Title.css";
import { useState } from "react";

type TitleProps = {
  taskCount: number;
  onTaskCreated?: () => void;
};

export default function Title({
  taskCount,
  onTaskCreated = () => {},
}: TitleProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
