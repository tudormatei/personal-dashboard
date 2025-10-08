from typing import List, Optional
from fastapi import APIRouter, BackgroundTasks, Query
from pydantic import BaseModel
from ..services.investments_service import request_full_period, run_monte_carlo_simulation
from uuid import uuid4

router = APIRouter()

jobs = {}


@router.get("/investments")
async def get_financial_data(
    start_date: Optional[str] = Query(
        None, description="ISO date e.g. 2024-01-01"),
    end_date: Optional[str] = Query(
        None, description="ISO date e.g. 2024-12-31")
):
    return await request_full_period(start_date, end_date)


def monte_carlo_task(job_id, start_value, twr_series, monthly_deposit, monthly_withdrawal,
                     days_ahead, sims, target_value):
    result = run_monte_carlo_simulation(
        start_value, twr_series,
        monthly_deposit=monthly_deposit,
        monthly_withdrawal=monthly_withdrawal,
        days_ahead=days_ahead,
        sims=sims,
        target_value=target_value
    )
    jobs[job_id] = result


class MonteCarloRequest(BaseModel):
    start_value: float
    twr_series: List[dict]
    monthly_deposit: float = 200
    monthly_withdrawal: float = 0
    days_ahead: int = 100
    sims: int = 5000
    target_value: float | None = None


@router.post("/monte-carlo-simulations")
async def start_monte_carlo(
    request: MonteCarloRequest,
    background_tasks: BackgroundTasks
):
    job_id = str(uuid4())
    jobs[job_id] = None

    background_tasks.add_task(
        monte_carlo_task,
        job_id,
        request.start_value,
        request.twr_series,
        request.monthly_deposit,
        request.monthly_withdrawal,
        request.days_ahead,
        request.sims,
        request.target_value
    )

    return {"job_id": job_id, "status": "running"}


@router.get("/monte-carlo-simulations/{job_id}")
async def get_monte_carlo_result(job_id: str):
    result = jobs.get(job_id)
    if result is None:
        return {"status": "running"}
    return {"status": "finished", "result": result}
