import { useQuery } from "@tanstack/react-query";

import { health } from "../api/health";

export function useHealthQuery() {
  return useQuery({
    queryKey: ["health"],
    queryFn: health,
    refetchInterval: 10000,
    retry: 1,
  });
}
