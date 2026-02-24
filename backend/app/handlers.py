import logging

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from .domain.error import ApiError

logger = logging.getLogger(__name__)

def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(HTTPException)
    async def http_exception_handler(_request: Request, exc: HTTPException):
        message = exc.detail if isinstance(exc.detail, list) else [str(exc.detail)]
        payload = ApiError(message=message, status_code=exc.status_code)
        content = payload.model_dump()
        logger.error(
            "json_response",
            extra={"status_code": exc.status_code, "content": content},
        )
        return JSONResponse(
            status_code=exc.status_code,
            content=content,
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        _request: Request, exc: RequestValidationError
    ):
        messages = [error.get("msg", "Invalid request") for error in exc.errors()]
        payload = ApiError(message=messages, status_code=422)
        content = payload.model_dump()
        logger.error(
            "json_response",
            extra={"status_code": 422, "content": content},
        )
        return JSONResponse(status_code=422, content=content)
