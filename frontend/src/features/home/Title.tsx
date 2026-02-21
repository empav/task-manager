import { Button, Typography, message } from "antd";
import type { ApiError, TaskCreate } from "../../types";
import CreateTaskModal from "./CreateTaskModal";
import "./Title.css";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateTaskMutation } from "../../hooks";

type TitleProps = {
  taskCount: number;
  onTaskCreated?: () => void;
};

export default function Title({
  taskCount,
  onTaskCreated = () => {},
}: TitleProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const createTaskMutation = useCreateTaskMutation();
  const queryClient = useQueryClient();

  const onCreate = async (values: TaskCreate) => {
    try {
      await createTaskMutation.mutateAsync(values);
      await queryClient.invalidateQueries({ queryKey: ["tasks", "count"] });
      message.success("Task created");
      setIsCreateModalOpen(false);
      onTaskCreated();
    } catch (err) {
      const error = err as ApiError;
      message.error(
        error?.message?.join(", ") ?? "An unexpected error occurred.",
      );
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
        isLoading={createTaskMutation.isPending}
        onCancel={() => setIsCreateModalOpen(false)}
        onCreate={onCreate}
      />
    </>
  );
}
