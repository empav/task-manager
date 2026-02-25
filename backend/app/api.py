from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

from . import logging as _logging
from .routers import auth, health, metrics, tasks
from .handlers import register_exception_handlers
from .lifespan import lifespan
from .middleware import audit_http_requests

app = FastAPI(
    title="Task Manager APIs",
    version="1.0.0",
    description="REST API for tasks with mocked JWT auth",
    docs_url="/docs",
    lifespan=lifespan
    )

register_exception_handlers(app)

Instrumentator(
    excluded_handlers=["/api/v1/health", "/api/v1/metrics", "/metrics"],
).instrument(app).expose(app)

app.middleware("http")(audit_http_requests)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api/v1")
app.include_router(metrics.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(tasks.router_v1, prefix="/api/v1")
app.include_router(tasks.router_v2, prefix="/api/v2")
