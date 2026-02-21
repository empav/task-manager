import { useQuery } from "@tanstack/react-query";

import { listTasks } from "../api/tasks";

export function useListTasksQuery() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: listTasks,
  });
}
