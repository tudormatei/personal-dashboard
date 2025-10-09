from fastapi import APIRouter

from .routers import health
from .routers import investments

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(investments.router, tags=["investments"])
