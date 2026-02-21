import hmac
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from jose import jwt
from ..config import (
    AUTH_PASSWORD_HASH,
    AUTH_USERNAME,
    JWT_ALGORITHM,
    JWT_SECRET,
)
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
async def login(payload: LoginRequest) -> LoginResponse:
    if not (
        hmac.compare_digest(payload.username, AUTH_USERNAME)
        and hmac.compare_digest(payload.password, AUTH_PASSWORD_HASH)
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token = create_access_token(payload.username)
    return LoginResponse(
        token=token,
    )
