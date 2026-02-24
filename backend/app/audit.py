from typing import Optional

from sqlmodel import Session

from .db import engine
from .domain.audit import AuditAction
from .models.audit_log import AuditLog


def write_audit_log(
    action: AuditAction,
    actor: str,
    payload: Optional[dict],
) -> None:
    with Session(engine) as session:
        session.add(
            AuditLog(
                action=action,
                actor=actor,
                payload=payload,
            )
        )
        session.commit()
