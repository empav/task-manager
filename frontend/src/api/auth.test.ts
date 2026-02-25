import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { login } from "./auth";
import { encodePassword } from "../utils";

vi.mock("../utils", () => ({
  encodePassword: vi.fn(),
}));

describe("login", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("posts encoded credentials and returns the response data", async () => {
    vi.mocked(encodePassword).mockResolvedValue("hashed-password");

    const responseData = { token: "token-123" };
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(responseData),
    });

    const request = { username: "alice", password: "secret" };
    const result = await login(request);

    expect(encodePassword).toHaveBeenCalledWith("secret");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, options] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe("http://localhost:8000/api/v1/auth/login");
    expect(options).toMatchObject({
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    expect(options?.body).toBe(
      JSON.stringify({ username: "alice", password: "hashed-password" }),
    );

    expect(result).toEqual(responseData);
  });

  it("throws an error when credentials are wrong", async () => {
    vi.mocked(encodePassword).mockResolvedValue("hashed-password");

    fetchMock.mockResolvedValue({
      ok: false,
      status: 401,
      json: vi.fn().mockResolvedValue({ message: ["Login failed"] }),
    });

    const request = { username: "alice", password: "wrong" };

    await expect(login(request)).rejects.toEqual({
      status_code: 401,
      message: ["Login failed"],
    });
  });
});
