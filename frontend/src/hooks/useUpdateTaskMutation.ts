import { useMutation } from "@tanstack/react-query";

import { updateTask } from "../api/tasks";
import type { TaskUpdate } from "../types";

type UpdateTaskInput = {
  taskId: number;
  payload: TaskUpdate;
};

export function useUpdateTaskMutation() {
  return useMutation({
    mutationFn: ({ taskId, payload }: UpdateTaskInput) =>
      updateTask(taskId, payload),
  });
}
