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
from ..metrics import ATTEMPT_LOGIN_TOTAL, ATTEMPT_LOGOUT_TOTAL, FAILED_LOGIN_TOTAL

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
    ATTEMPT_LOGIN_TOTAL.inc()
    if not (
        hmac.compare_digest(payload.username, AUTH_USERNAME)
        and hmac.compare_digest(payload.password, AUTH_PASSWORD_HASH)
    ):
        FAILED_LOGIN_TOTAL.inc()
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


@router.post("/auth/logout", status_code=status.HTTP_200_OK, tags=["auth"])
async def logout(
    background_tasks: BackgroundTasks,
) -> None:
    ATTEMPT_LOGOUT_TOTAL.inc()
    background_tasks.add_task(
        write_audit_log,
        AuditAction.LOGOUT,
        actor=AUTH_USERNAME,
        payload={
            "description": "User logged out",
        },
    )
    return None
