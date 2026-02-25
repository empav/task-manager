import { useQuery } from "@tanstack/react-query";

import { getMetrics } from "../api/metrics";

export function useMetricsQuery() {
  return useQuery({
    queryKey: ["metrics"],
    queryFn: getMetrics,
  });
}
