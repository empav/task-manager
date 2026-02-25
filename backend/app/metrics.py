from prometheus_client import Counter, Summary

TASKS_CREATED_TOTAL = Counter(
    "tasks_created_total",
    "Total number of tasks created.",
)
TASKS_DELETED_TOTAL = Counter(
    "tasks_deleted_total",
    "Total number of tasks deleted.",
)
TASK_UPDATED_TOTAL = Counter(
    "task_updated_total",
    "Total number of tasks updated.",
)
ATTEMPT_LOGIN_TOTAL = Counter(
    "attempt_login_total",
    "Total number of login attempts.",
)
ATTEMPT_LOGOUT_TOTAL = Counter(
    "attempt_logout_total",
    "Total number of logout attempts.",
)
FAILED_LOGIN_TOTAL = Counter(
    "failed_login_total",
    "Total number of failed login attempts.",
)
LIST_TASKS_V2_AVG_RESPONSE_TIME_SECONDS = Summary(
    "list_tasks_v2_avg_response_time_seconds",
    "Average response time for list_tasks_v2 endpoint in seconds.",
)
