import { describe, expect, it } from "vitest";

import { encodePassword } from "./index";

describe("encodePassword", () => {
  it("hashes a password with SHA-256", async () => {
    const result = await encodePassword("password");

    expect(result).toBe(
      "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    );
  });
});
