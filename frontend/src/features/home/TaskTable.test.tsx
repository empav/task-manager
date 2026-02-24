import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import TaskTable from "./TaskTable";

const listTasksQueryMock = vi.fn();
const createTaskMutationMock = vi.fn();
const updateTaskMutationMock = vi.fn();
const deleteTaskMutationMock = vi.fn();

vi.mock("../../hooks", () => ({
  useListTasksQuery: () => listTasksQueryMock(),
  useCreateTaskMutation: () => createTaskMutationMock(),
  useUpdateTaskMutation: () => updateTaskMutationMock(),
  useDeleteTaskMutation: () => deleteTaskMutationMock(),
  useListTasksPaginatedQuery: ({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }) => listTasksQueryMock({ page, pageSize }),
}));

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));

describe("TaskTable", () => {
  beforeEach(() => {
    listTasksQueryMock.mockReturnValue({
      data: { items: [], total: 0 },
      isLoading: false,
    });
    createTaskMutationMock.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
    updateTaskMutationMock.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
    deleteTaskMutationMock.mockReturnValue({ mutateAsync: vi.fn() });
  });

  it("matches snapshot", () => {
    const html = renderToStaticMarkup(<TaskTable />);
    expect(html).toMatchSnapshot();
  });

  it("renders task rows when data is available", () => {
    listTasksQueryMock.mockReturnValue({
      data: {
        items: [
          {
            id: 1,
            title: "Write tests",
            description: "Cover TaskTable rendering",
            status: "Done",
            created_at: "2024-01-01T10:00:00.000Z",
          },
        ],
        total: 1,
      },
      isLoading: false,
    });

    const html = renderToStaticMarkup(<TaskTable />);
    expect(html).toContain("Write tests");
    expect(html).toContain("Cover TaskTable rendering");
    expect(html).toContain('aria-label="Done"');
  });

  it("renders status labels for in-progress tasks", () => {
    listTasksQueryMock.mockReturnValue({
      data: {
        items: [
          {
            id: 2,
            title: "Implement filters",
            description: null,
            status: "In Progress",
            created_at: "2024-01-02T08:30:00.000Z",
          },
        ],
        total: 1,
      },
      isLoading: false,
    });

    const html = renderToStaticMarkup(<TaskTable />);
    expect(html).toContain("Implement filters");
    expect(html).toContain('aria-label="In Progress"');
  });
});
