import hashlib
import hmac
import os
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from jose import jwt
from ..schemas.auth import LoginRequest, TokenResponse

router = APIRouter()

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

AUTH_USERNAME = os.getenv("AUTH_USERNAME", "admin")
AUTH_PASSWORD = os.getenv("AUTH_PASSWORD", "admin")
AUTH_PASSWORD_HASH = hashlib.sha256(AUTH_PASSWORD.encode("utf-8")).hexdigest()


def create_access_token(subject: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": subject,
        "iat": int(now.timestamp()),
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token


@router.post("/auth/login", response_model=TokenResponse, tags=["auth"])
async def login(payload: LoginRequest) -> TokenResponse:
    if not (
        hmac.compare_digest(payload.username, AUTH_USERNAME)
        and hmac.compare_digest(payload.password, AUTH_PASSWORD_HASH)
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token = create_access_token(payload.username)
    return TokenResponse(
        token=token,
    )
