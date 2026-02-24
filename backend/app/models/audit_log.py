from datetime import datetime
from typing import Optional

from sqlalchemy import JSON, Column, Integer, String
from sqlmodel import Field, SQLModel

from ..domain.audit import AuditAction

class AuditLog(SQLModel, table=True):
    __tablename__ = "audit_logs"

    id: Optional[int] = Field(
        default=None,
        sa_column=Column(Integer, primary_key=True, autoincrement=True),
    )
    action: AuditAction = Field(sa_column=Column(String, nullable=False))
    actor: str = Field(sa_column=Column(String, nullable=False))
    payload: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.now)
