import type { JSX } from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import type { TaskRead } from "../types";

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

export const TASK_TABLE_PAGE_SIZE = 5;

export const ICON_BY_STATUS: Record<TaskRead["status"], JSX.Element> = {
  Open: <Circle size={16} aria-hidden="true" />,
  "In Progress": <Clock size={16} aria-hidden="true" color="orange" />,
  Done: <CheckCircle2 size={16} aria-hidden="true" color="green" />,
};
