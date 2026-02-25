import { Card, Statistic } from "antd";
import type { Metrics as MetricsType } from "../../types";
import { useMetricsQuery } from "../../hooks";
import "./Metrics.css";

const METRICS: Array<{
  key: keyof MetricsType;
  label: string;
  precision?: number;
  suffix?: string;
}> = [
  { key: "tasks_created_total", label: "Tasks created" },
  { key: "task_updated_total", label: "Tasks updated" },
  { key: "tasks_deleted_total", label: "Tasks deleted" },
  { key: "attempt_login_total", label: "Login attempts" },
  { key: "attempt_logout_total", label: "Logout attempts" },
  { key: "failed_login_total", label: "Failed logins" },
  {
    key: "list_tasks_v2_avg_response_time_seconds",
    label: "List Tasks v2 avg response time",
    precision: 3,
    suffix: "s",
  },
];

export default function Metrics() {
  const { data, isLoading } = useMetricsQuery();

  if (isLoading || !data) return null;

  return (
    <div className="metrics-container" aria-label="App metrics">
      <div className="metrics-grid">
        {METRICS.map(({ key, label, precision, suffix }) => (
          <Card key={key} size="small" className="metrics-card">
            <Statistic
              title={label}
              value={data[key] ?? 0}
              precision={precision}
              suffix={suffix}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
