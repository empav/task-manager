import { useMutation } from "@tanstack/react-query";

import { createTask } from "../api/tasks";

export function useCreateTaskMutation() {
  return useMutation({
    mutationFn: createTask,
  });
}
