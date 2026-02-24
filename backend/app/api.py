from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import auth, health, tasks
from .handlers import register_exception_handlers
from .lifespan import lifespan

app = FastAPI(lifespan=lifespan)
register_exception_handlers(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(tasks.router_v1, prefix="/api/v1")
app.include_router(tasks.router_v2, prefix="/api/v2")
