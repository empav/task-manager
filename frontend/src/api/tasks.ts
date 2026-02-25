import type {
  ApiError,
  PaginatedTaskListRequest,
  PaginatedTaskListResponse,
  TaskCreate,
  TaskRead,
  TaskUpdate,
} from "../types";
import { BASE_URL } from "../utils/constants";

function buildAuthHeaders(): Record<string, string> {
  const token = sessionStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function requestJson<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeaders(),
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (res.ok) {
    if (res.status === 204) {
      return undefined as T;
    }
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
  } as ApiError;
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
  if (req.description?.length) {
    params.set("description", req.description);
  }
  if (req.status) {
    params.set("status", req.status);
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
  await requestJson<void>(`/v1/tasks/${taskId}`, {
    method: "DELETE",
  });
}

export async function countTasks(): Promise<number> {
  return requestJson<number>("/v1/tasks/count");
}
