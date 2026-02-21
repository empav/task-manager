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

export type TaskStatus = "Open" | "In Progress" | "Done";

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

export type TaskDelete = {
  id: number;
};
