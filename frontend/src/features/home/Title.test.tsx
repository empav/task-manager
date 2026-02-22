import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import Title from "./Title";

vi.mock("../../hooks", () => ({
  useCreateTaskMutation: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));

describe("Title", () => {
  it("matches snapshot", () => {
    const html = renderToStaticMarkup(<Title taskCount={0} />);
    expect(html).toMatchSnapshot();
  });
});
