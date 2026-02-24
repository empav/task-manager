export type HealthStatus = boolean;

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type ApiError = {
  status_code: number;
  message: string[];
};

export const TASK_STATUS_OPTIONS = ["Open", "In Progress", "Done"] as const;
export type TaskStatus = (typeof TASK_STATUS_OPTIONS)[number];

export type TaskCreate = {
  title: string;
  description?: string | null;
  status?: TaskStatus;
};

export type TaskUpdate = {
  title?: string | null;
  description?: string | null;
  status?: TaskStatus | null;
};

export type TaskRead = {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
};

export type PaginatedTaskListRequest = {
  page: number;
  pageSize: number;
  title?: string;
  description?: string;
  status?: TaskStatus;
};

export type PaginatedTaskListResponse = {
  items: TaskRead[];
  total: number;
};
