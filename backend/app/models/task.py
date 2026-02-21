from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import Column, Enum as SAEnum, Integer
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
    status: TaskStatus = Field(
        default=TaskStatus.OPEN,
        sa_column=Column(SAEnum(TaskStatus), nullable=False),
    )
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
