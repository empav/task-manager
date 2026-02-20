import type { HealthStatus } from "../types";

export async function health(): Promise<HealthStatus> {
  const res = await fetch("http://localhost:8000/health");
  return res.ok;
}
