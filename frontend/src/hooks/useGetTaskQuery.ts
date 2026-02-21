import { useQuery } from "@tanstack/react-query";

import { getTask } from "../api/tasks";

export function useGetTaskQuery(taskId: number) {
  return useQuery({
    queryKey: ["tasks", taskId],
    queryFn: () => getTask(taskId),
    enabled: typeof taskId === "number",
  });
}
