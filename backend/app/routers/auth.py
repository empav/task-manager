import hmac
from datetime import datetime, timezone
from fastapi import APIRouter, BackgroundTasks, HTTPException, status
from jose import jwt
from ..config import (
    AUTH_PASSWORD_HASH,
    AUTH_USERNAME,
    JWT_ALGORITHM,
    JWT_SECRET,
)
from ..audit import write_audit_log
from ..domain.audit import AuditAction
from ..domain.auth import LoginRequest, LoginResponse

router = APIRouter()


def create_access_token(subject: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": subject,
        "iat": int(now.timestamp()),
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token


@router.post("/auth/login", response_model=LoginResponse, tags=["auth"])
async def login(
    payload: LoginRequest,
    background_tasks: BackgroundTasks,
) -> LoginResponse:
    if not (
        hmac.compare_digest(payload.username, AUTH_USERNAME)
        and hmac.compare_digest(payload.password, AUTH_PASSWORD_HASH)
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token = create_access_token(payload.username)
    
    background_tasks.add_task(
        write_audit_log,
        AuditAction.LOGIN,
        actor=AUTH_USERNAME,
        payload={
            "description": "User logged in",
        },
    )
    
    return LoginResponse(
        token=token,
    )
