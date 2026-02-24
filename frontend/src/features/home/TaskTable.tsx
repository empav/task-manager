import { Button, Popconfirm, Table, Tooltip, message } from "antd";
import type { TableProps } from "antd";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { ApiError, TaskCreate, TaskRead } from "../../types";
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useListTasksPaginatedQuery,
  useUpdateTaskMutation,
} from "../../hooks";
import UpsertTaskModal from "./UpsertTaskModal";
import { Pencil, Trash2 } from "lucide-react";
import "./TaskTable.css";
import { ICON_BY_STATUS, TASK_TABLE_PAGE_SIZE } from "../../utils/constants";

export default function TaskTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(TASK_TABLE_PAGE_SIZE);
  const [titleFilter, setTitleFilter] = useState<string>("");
  const [descriptionFilter, setDescriptionFilter] = useState<string>("");
  const { data, isLoading } = useListTasksPaginatedQuery({
    page: currentPage,
    pageSize,
    title: titleFilter,
    description: descriptionFilter,
  });

  const tasks = useMemo(() => data?.items ?? [], [data?.items]);
  const total = data?.total ?? 0;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskRead | null>(null);

  const queryClient = useQueryClient();
  const createTaskMutation = useCreateTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();

  const titleFilters = useMemo(() => {
    const titles = new Set(tasks.map((task) => task.title));
    if (titleFilter) titles.add(titleFilter);
    return Array.from(titles, (title) => ({ text: title, value: title }));
  }, [tasks, titleFilter]);
  const descriptionFilters = useMemo(() => {
    const descriptions = new Set(
      tasks
        .map((task) => task.description)
        .filter((description): description is string => Boolean(description)),
    );
    if (descriptionFilter) descriptions.add(descriptionFilter);
    return Array.from(descriptions, (description) => ({
      text: description,
      value: description,
    }));
  }, [tasks, descriptionFilter]);

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

  const handleTableChange: TableProps<TaskRead>["onChange"] = (
    pagination,
    filters,
    _sorter,
    extra,
  ) => {
    const nextPage = pagination.current ?? 1;
    const nextPageSize = pagination.pageSize ?? TASK_TABLE_PAGE_SIZE;
    const nextTitleFilter = Array.isArray(filters.title)
      ? ((filters.title[0] as string) ?? "")
      : extra.action === "filter"
        ? ""
        : titleFilter;
    const nextDescriptionFilter = Array.isArray(filters.description)
      ? ((filters.description[0] as string) ?? "")
      : extra.action === "filter"
        ? ""
        : descriptionFilter;

    if (
      nextTitleFilter !== titleFilter ||
      nextDescriptionFilter !== descriptionFilter
    ) {
      setCurrentPage(1);
      setTitleFilter(nextTitleFilter);
      setDescriptionFilter(nextDescriptionFilter);
    } else {
      setCurrentPage(nextPage);
    }
    setPageSize(nextPageSize);
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
            filteredValue: titleFilter ? [titleFilter] : null,
            filterSearch: true,
            sorter: (a, b) => a.title.localeCompare(b.title),
          },
          {
            title: "Description",
            dataIndex: "description",
            key: "description",
            filters: descriptionFilters,
            filteredValue: descriptionFilter ? [descriptionFilter] : null,
            filterSearch: true,
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
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
        showSorterTooltip={{ target: "sorter-icon" }}
      />
    </>
  );
}
