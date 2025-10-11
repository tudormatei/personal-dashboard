from fastapi import APIRouter

from .routers import health
from .routers import investments
from .routers import bank

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(investments.router, tags=["investments"])
api_router.include_router(bank.router, tags=["bank"])
