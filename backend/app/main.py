from contextlib import asynccontextmanager
from fastapi import FastAPI

from .repositories.health import init_db
from .api.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Personal Dashboard", lifespan=lifespan)

app.include_router(api_router, prefix="/api")
