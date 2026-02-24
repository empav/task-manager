from enum import Enum


class AuditAction(str, Enum):
    TASK_CREATED = "task_created"
