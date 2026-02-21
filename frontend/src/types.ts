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

export type LoginError = {
  detail?: string;
};
