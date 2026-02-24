from datetime import datetime
from typing import Annotated, Optional

from pydantic import BaseModel, StringConstraints

from ..models.task import TaskStatus


class TaskCreate(BaseModel):
    title: Annotated[str, StringConstraints(min_length=1, max_length=200)]
    description: Optional[Annotated[str, StringConstraints(max_length=2000)]] = None
    status: TaskStatus = TaskStatus.OPEN


class TaskUpdate(BaseModel):
    title: Optional[Annotated[str, StringConstraints(min_length=1, max_length=200)]] = None
    description: Optional[Annotated[str, StringConstraints(max_length=2000)]] = None
    status: Optional[TaskStatus] = None


class TaskRead(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    status: TaskStatus
    created_at: datetime
    updated_at: datetime

