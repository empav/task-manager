import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import Home from "./Home";

const sessionStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(globalThis, "sessionStorage", {
  value: sessionStorageMock,
  writable: true,
});

vi.mock("../../hooks", () => {
  return {
    useCountTasksQuery: () => ({ data: 0, isLoading: false }),
    useHealthQuery: () => ({ data: true, isLoading: false }),
    useCreateTaskMutation: () => ({ mutateAsync: vi.fn(), isPending: false }),
    useListTasksQuery: () => ({ data: [], isLoading: false }),
    useUpdateTaskMutation: () => ({ mutateAsync: vi.fn(), isPending: false }),
    useDeleteTaskMutation: () => ({ mutateAsync: vi.fn() }),
  };
});

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("Home", () => {
  it("matches snapshot", () => {
    const html = renderToStaticMarkup(<Home />);
    expect(html).toMatchSnapshot();
  });
});
