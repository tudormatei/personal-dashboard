from fastapi import APIRouter

from .routers import health
from .routers import investments
from .routers import bank
from .routers import mastery

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(investments.router, tags=["investments"])
api_router.include_router(bank.router, tags=["bank"])
api_router.include_router(mastery.router, tags=["mastery"])
