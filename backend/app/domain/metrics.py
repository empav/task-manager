from pydantic import BaseModel


class MetricsRead(BaseModel):
    tasks_created_total: int
    tasks_deleted_total: int
    task_updated_total: int
    attempt_login_total: int
    attempt_logout_total: int
    failed_login_total: int
    list_tasks_v2_avg_response_time_seconds: float
