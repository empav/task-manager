import type { LoginRequest, LoginResponse } from "../types";
import { encodePassword } from "../utils";

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const encodedPassword = await encodePassword(request.password);
  const payload = { ...request, password: encodedPassword };

  const res = await fetch("http://localhost:8000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await res.json();
      throw data;
    }
    const message = await res.text();
    throw new Error(message || "Login failed");
  }

  return res.json();
}
