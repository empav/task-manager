from contextlib import asynccontextmanager
from fastapi import FastAPI

from .db import create_db_and_tables, engine


@asynccontextmanager
async def lifespan(_app: FastAPI):
    create_db_and_tables()
    yield
    engine.dispose()
