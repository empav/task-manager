import type { ApiError, LoginRequest, LoginResponse } from "../types";
import { encodePassword } from "../utils";
import { BASE_URL } from "../utils/constants";

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const encodedPassword = await encodePassword(request.password);
  const payload = { ...request, password: encodedPassword };

  const res = await fetch(`${BASE_URL}/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw {
      status_code: res.status,
      message: ["Login failed"],
    } as ApiError;
  }

  return data;
}

export async function logout(): Promise<void> {
  const res = await fetch(`${BASE_URL}/v1/auth/logout`, {
    method: "POST",
  });
  if (!res.ok) {
    throw {
      status_code: res.status,
      message: ["Logout failed"],
    } as ApiError;
  }
}
