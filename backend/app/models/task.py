from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import Column, Integer
from sqlmodel import Field, SQLModel


class TaskStatus(str, Enum):
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    DONE = "Done"


class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(
        default=None,
        sa_column=Column(Integer, primary_key=True, autoincrement=True),
    )
    title: str
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.OPEN
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
