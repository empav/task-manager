import type {
  ApiError,
  PaginatedTaskListRequest,
  PaginatedTaskListResponse,
  TaskCreate,
  TaskRead,
  TaskUpdate,
} from "../types";
import { BASE_URL } from "../utils/constants";

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
  return requestJson<TaskRead>("/v1/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function listTasksPaginated(
  req: PaginatedTaskListRequest,
): Promise<PaginatedTaskListResponse | TaskRead[]> {
  const params = new URLSearchParams({
    page: req.page.toString(),
    page_size: req.pageSize.toString(),
  });
  if (req.title?.length) {
    params.set("title", req.title);
  }
  return requestJson<PaginatedTaskListResponse>(
    `/v2/tasks?${params.toString()}`,
  );
}

export async function listTasks(): Promise<TaskRead[]> {
  return requestJson<TaskRead[]>("/v1/tasks");
}

export async function getTask(taskId: number): Promise<TaskRead> {
  return requestJson<TaskRead>(`/v1/tasks/${taskId}`);
}

export async function updateTask(
  taskId: number,
  payload: TaskUpdate,
): Promise<TaskRead> {
  return requestJson<TaskRead>(`/v1/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteTask(taskId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/v1/tasks/${taskId}`, {
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
  return requestJson<number>("/v1/tasks/count");
}
