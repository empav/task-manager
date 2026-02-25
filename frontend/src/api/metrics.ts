import type { ApiError, Metrics } from "../types";
import { BASE_URL } from "../utils/constants";

export async function getMetrics(): Promise<Metrics> {
  const res = await fetch(`${BASE_URL}/v1/metrics`, {
    headers: { "Content-Type": "application/json" },
  });

  if (res.ok) {
    return (await res.json()) as Metrics;
  }
  throw {
    status_code: res.status,
    message: ["Failed to retrieve metrics"],
  } as ApiError;
}
