from contextlib import asynccontextmanager
from fastapi import FastAPI

from .repositories.health import init_health_tables
from .repositories.bank import init_bank_table
from .api.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_health_tables()
    init_bank_table()
    yield


app = FastAPI(title="Personal Dashboard", lifespan=lifespan)

app.include_router(api_router, prefix="/api")
