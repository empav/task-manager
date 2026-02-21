from typing import List

from pydantic import BaseModel, conint


class ApiError(BaseModel):
    message: List[str]
    status_code: int
