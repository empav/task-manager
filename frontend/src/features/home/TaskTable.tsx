import { Button, Popconfirm, Table, Tooltip, message } from "antd";
import { useMemo, useState, type JSX } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { ApiError, TaskCreate, TaskRead } from "../../types";
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useListTasksQuery,
  useUpdateTaskMutation,
} from "../../hooks";
import UpsertTaskModal from "./UpsertTaskModal";
import { CheckCircle2, Circle, Clock, Pencil, Trash2 } from "lucide-react";
import "./TaskTable.css";

const ICON_BY_STATUS: Record<TaskRead["status"], JSX.Element> = {
  Open: <Circle size={16} aria-hidden="true" />,
  "In Progress": <Clock size={16} aria-hidden="true" color="orange" />,
  Done: <CheckCircle2 size={16} aria-hidden="true" color="green" />,
};

export default function TaskTable() {
  const { data: tasks = [], isLoading } = useListTasksQuery();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskRead | null>(null);

  const queryClient = useQueryClient();
  const createTaskMutation = useCreateTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();

  const { titleFilters, descriptionFilters } = useMemo(() => {
    const seenTitles = new Set<string>();
    const seenDescriptions = new Set<string>();
    const titleFiltersLocal: { text: string; value: string }[] = [];
    const descriptionFiltersLocal: { text: string; value: string }[] = [];
    for (const task of tasks) {
      const title = task.title;
      if (!seenTitles.has(title)) {
        seenTitles.add(title);
        titleFiltersLocal.push({ text: title, value: title });
      }
      const description = task.description;
      if (description && !seenDescriptions.has(description)) {
        seenDescriptions.add(description);
        descriptionFiltersLocal.push({ text: description, value: description });
      }
    }
    return {
      titleFilters: titleFiltersLocal,
      descriptionFilters: descriptionFiltersLocal,
    };
  }, [tasks]);

  const onEditOpen = (task: TaskRead) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const onEditCancel = () => {
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  const onCreate = async (values: TaskCreate) => {
    try {
      await createTaskMutation.mutateAsync(values);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["tasks"] }),
        queryClient.invalidateQueries({ queryKey: ["tasks", "count"] }),
      ]);
      message.success("Task created");
      setIsCreateModalOpen(false);
    } catch (err) {
      const error = err as ApiError;
      message.error(
        error?.message?.join(", ") ?? "An unexpected error occurred.",
      );
    }
  };

  const onUpdate = async (values: TaskCreate) => {
    if (!editingTask) return;
    try {
      await updateTaskMutation.mutateAsync({
        taskId: editingTask.id,
        payload: values,
      });
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      message.success("Task updated");
      onEditCancel();
    } catch (err) {
      const error = err as ApiError;
      message.error(
        error?.message?.join(", ") ?? "An unexpected error occurred.",
      );
    }
  };

  const onDelete = async (taskId: number) => {
    try {
      await deleteTaskMutation.mutateAsync(taskId);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["tasks"] }),
        queryClient.invalidateQueries({ queryKey: ["tasks", "count"] }),
      ]);
      message.success("Task deleted");
    } catch (err) {
      const error = err as ApiError;
      message.error(
        error?.message?.join(", ") ?? "An unexpected error occurred.",
      );
    }
  };

  return (
    <>
      <UpsertTaskModal
        open={isCreateModalOpen}
        isLoading={createTaskMutation.isPending}
        onCancel={() => setIsCreateModalOpen(false)}
        onSubmit={onCreate}
      />
      <UpsertTaskModal
        open={isEditModalOpen}
        isLoading={updateTaskMutation.isPending}
        onCancel={onEditCancel}
        onSubmit={onUpdate}
        mode="edit"
        initialValues={{
          title: editingTask?.title ?? "",
          description: editingTask?.description ?? undefined,
          status: editingTask?.status ?? "Open",
        }}
      />
      <div className="task-table-header">
        <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
          Create task
        </Button>
      </div>
      <Table
        columns={[
          {
            title: "Title",
            dataIndex: "title",
            key: "title",
            filters: titleFilters,
            filterSearch: true,
            onFilter: (value, record) => record.title.includes(value as string),
            sorter: (a, b) => a.title.localeCompare(b.title),
          },
          {
            title: "Description",
            dataIndex: "description",
            key: "description",
            filters: descriptionFilters,
            filterSearch: true,
            onFilter: (value, record) =>
              record.description?.includes(value as string) ?? false,
            sorter: (a, b) =>
              a.description && b.description
                ? a.description.localeCompare(b.description)
                : 0,
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: TaskRead["status"]) => {
              return (
                <Tooltip title={status}>
                  <span aria-label={status}>{ICON_BY_STATUS[status]}</span>
                </Tooltip>
              );
            },
          },
          {
            title: "Created",
            dataIndex: "created_at",
            key: "created_at",
            render: (value: string) => new Date(value).toLocaleString(),
            sorter: (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime(),
          },
          {
            title: "Actions",
            key: "actions",
            render: (_: unknown, record: TaskRead) => (
              <div className="task-table-actions">
                <Tooltip title="Edit task">
                  <Button
                    type="text"
                    icon={<Pencil size={16} />}
                    onClick={() => onEditOpen(record)}
                    aria-label={`Edit ${record.title}`}
                  />
                </Tooltip>
                <Popconfirm
                  title="Delete task?"
                  description="This action cannot be undone."
                  okText="Delete"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => onDelete(record.id)}
                >
                  <Tooltip title="Delete task">
                    <Button
                      type="text"
                      danger
                      icon={<Trash2 size={16} />}
                      aria-label={`Delete ${record.title}`}
                    />
                  </Tooltip>
                </Popconfirm>
              </div>
            ),
          },
        ]}
        dataSource={tasks}
        loading={isLoading}
        rowKey="id"
        className="home-main-table"
        title={() => "Task List"}
        pagination={{ pageSize: 5 }}
        showSorterTooltip={{ target: "sorter-icon" }}
      />
    </>
  );
}
