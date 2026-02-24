import type { HealthStatus } from "../types";
import { BASE_URL } from "../utils/constants";

export async function health(): Promise<HealthStatus> {
  const res = await fetch(`${BASE_URL}/v1/health`);
  return res.ok;
}
