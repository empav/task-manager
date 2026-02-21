from typing import Annotated

from pydantic import BaseModel, StringConstraints


class LoginRequest(BaseModel):
    username: Annotated[str, StringConstraints(min_length=3, max_length=50)]
    password: Annotated[str, StringConstraints(min_length=4, max_length=128)]


class LoginResponse(BaseModel):
    token: str
