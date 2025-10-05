from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Query
from ..services.investments_service import request_financial_data, request_full_period

router = APIRouter()


router = APIRouter()


@router.get("/investments")
async def get_financial_data(
    start_date: Optional[str] = Query(
        None, description="ISO date e.g. 2024-01-01"),
    end_date: Optional[str] = Query(
        None, description="ISO date e.g. 2024-12-31")
):
    return await request_full_period(start_date, end_date)
