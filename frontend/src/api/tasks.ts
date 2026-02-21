import type { ApiError, TaskCreate, TaskRead, TaskUpdate } from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

async function requestJson<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (res.ok) {
    return (await res.json()) as T;
  }

  let payload: ApiError | null = null;
  try {
    payload = (await res.json()) as ApiError;
  } catch {
    payload = null;
  }

  throw {
    status_code: res.status,
    message: payload?.message ?? ["An unexpected error occurred."],
  };
}

export async function createTask(payload: TaskCreate): Promise<TaskRead> {
  return requestJson<TaskRead>("/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function listTasks(): Promise<TaskRead[]> {
  return requestJson<TaskRead[]>("/tasks");
}

export async function getTask(taskId: number): Promise<TaskRead> {
  return requestJson<TaskRead>(`/tasks/${taskId}`);
}

export async function updateTask(
  taskId: number,
  payload: TaskUpdate,
): Promise<TaskRead> {
  return requestJson<TaskRead>(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteTask(taskId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    return;
  }

  let payload: ApiError | null = null;
  try {
    payload = (await res.json()) as ApiError;
  } catch {
    payload = null;
  }

  throw {
    status_code: res.status,
    message: payload?.message ?? ["An unexpected error occurred."],
  };
}

export async function countTasks(): Promise<number> {
  return requestJson<number>("/tasks/count");
}
