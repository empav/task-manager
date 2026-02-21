import { useQuery } from "@tanstack/react-query";

import { countTasks } from "../api/tasks";

export function useCountTasksQuery() {
  return useQuery({
    queryKey: ["tasks", "count"],
    queryFn: countTasks,
  });
}
