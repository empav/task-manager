import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import LoginPage from "./Login";

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

vi.mock("../../hooks", () => ({
  useLoginMutation: () => ({ mutateAsync: vi.fn(), isPending: false }),
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

describe("Login", () => {
  it("matches snapshot", () => {
    const html = renderToStaticMarkup(<LoginPage />);
    expect(html).toMatchSnapshot();
  });
});
