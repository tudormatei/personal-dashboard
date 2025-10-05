from fastapi import APIRouter
from . import health_router
from . import investments_router

api_router = APIRouter()

api_router.include_router(health_router.router, tags=["health"])
api_router.include_router(investments_router.router, tags=["investments"])
