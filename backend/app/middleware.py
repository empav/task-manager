import asyncio
import time

from fastapi import Request

from .audit import write_audit_log
from .domain.audit import AuditAction


async def audit_http_requests(request: Request, call_next):
    start_time = time.time()
    status_code = 500
    try:
        response = await call_next(request)
        status_code = response.status_code
        return response
    finally:
        duration_ms = round((time.time() - start_time) * 1000)
        await asyncio.to_thread(
            write_audit_log,
            AuditAction.HTTP_REQUEST,
            actor="system",
            payload={
                "path": request.url.path,
                "method": request.method,
                "status_code": status_code,
                "duration_ms": duration_ms,
            },
        )
