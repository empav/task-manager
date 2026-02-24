import type { HealthStatus } from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export async function health(): Promise<HealthStatus> {
  const res = await fetch(`${BASE_URL}/api/v1/health`);
  return res.ok;
}
