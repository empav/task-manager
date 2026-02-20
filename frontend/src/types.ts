export type HealthStatus = boolean;

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};
