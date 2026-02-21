import type { LoginRequest, LoginResponse } from "../types";
import { encodePassword } from "../utils";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const encodedPassword = await encodePassword(request.password);
  const payload = { ...request, password: encodedPassword };

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw { status_code: res.status, message: data.message ?? "Login failed" };
  }

  return data;
}
