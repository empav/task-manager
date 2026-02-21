import { useMutation } from "@tanstack/react-query";

import { deleteTask } from "../api/tasks";

export function useDeleteTaskMutation() {
  return useMutation({
    mutationFn: deleteTask,
  });
}
