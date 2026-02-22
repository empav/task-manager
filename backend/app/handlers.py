from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from .domain.error import ApiError


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(HTTPException)
    async def http_exception_handler(_request: Request, exc: HTTPException):
        message = exc.detail if isinstance(exc.detail, list) else [str(exc.detail)]
        payload = ApiError(message=message, status_code=exc.status_code)
        return JSONResponse(
            status_code=exc.status_code,
            content=payload.model_dump(),
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        _request: Request, exc: RequestValidationError
    ):
        messages = [error.get("msg", "Invalid request") for error in exc.errors()]
        payload = ApiError(message=messages, status_code=422)
        return JSONResponse(status_code=422, content=payload.model_dump())
