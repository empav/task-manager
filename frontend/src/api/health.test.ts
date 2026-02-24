import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { health } from "./health";

describe("health", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return true when health endpoint responds with ok status", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
    });
    global.fetch = mockFetch;

    const result = await health();

    expect(result).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8000/api/v1/health",
    );
  });

  it("should throw an error when fetch fails", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error("Network error"));
    global.fetch = mockFetch;

    await expect(health()).rejects.toThrow("Network error");
  });
});
