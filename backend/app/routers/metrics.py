from fastapi import APIRouter

from ..domain.metrics import MetricsRead
from ..metrics import (
    ATTEMPT_LOGIN_TOTAL,
    ATTEMPT_LOGOUT_TOTAL,
    FAILED_LOGIN_TOTAL,
    LIST_TASKS_V2_AVG_RESPONSE_TIME_SECONDS,
    TASKS_CREATED_TOTAL,
    TASKS_DELETED_TOTAL,
    TASK_UPDATED_TOTAL,
)

router = APIRouter()


@router.get("/metrics", response_model=MetricsRead, tags=["metrics"])
def get_metrics() -> MetricsRead:
    v2_count = LIST_TASKS_V2_AVG_RESPONSE_TIME_SECONDS._count.get()
    v2_sum = LIST_TASKS_V2_AVG_RESPONSE_TIME_SECONDS._sum.get()
    v2_avg = (v2_sum / v2_count) if v2_count else 0.0

    return MetricsRead(
        tasks_created_total=TASKS_CREATED_TOTAL._value.get(),
        tasks_deleted_total=TASKS_DELETED_TOTAL._value.get(),
        task_updated_total=TASK_UPDATED_TOTAL._value.get(),
        attempt_login_total=ATTEMPT_LOGIN_TOTAL._value.get(),
        attempt_logout_total=ATTEMPT_LOGOUT_TOTAL._value.get(),
        failed_login_total=FAILED_LOGIN_TOTAL._value.get(),
        list_tasks_v2_avg_response_time_seconds=v2_avg,
    )
