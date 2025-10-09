from typing import Optional
from fastapi import APIRouter, BackgroundTasks, HTTPException, status
from uuid import uuid4

from ...utils.validation import validate_iso_date

from ...schemas.investments import (
    FinancialReport,
    MonteCarloRequest,
    MonteCarloResponse,
)
from ...services.investments import (
    request_full_period,
    run_monte_carlo_simulation,
)

router = APIRouter(prefix="/investments")

jobs = {}


@router.get("/")
async def get_financial_data(
    start_date: Optional[str] = None, end_date: Optional[str] = None
) -> FinancialReport | None:
    validate_iso_date(start_date, "start_date")
    validate_iso_date(end_date, "end_date")

    return await request_full_period(start_date, end_date)


def monte_carlo_task(
    job_id,
    start_value,
    twr_series,
    monthly_deposit,
    monthly_withdrawal,
    days_ahead,
    sims,
    target_value,
):
    result = run_monte_carlo_simulation(
        start_value,
        twr_series,
        monthly_deposit=monthly_deposit,
        monthly_withdrawal=monthly_withdrawal,
        days_ahead=days_ahead,
        sims=sims,
        target_value=target_value,
    )
    jobs[job_id] = result


@router.post("/monte-carlo-simulations", status_code=status.HTTP_202_ACCEPTED)
async def start_monte_carlo_simulation(
    request: MonteCarloRequest, background_tasks: BackgroundTasks
) -> MonteCarloResponse:
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
        request.target_value,
    )

    return {"job_id": job_id, "status": "running"}


@router.get("/monte-carlo-simulations/{job_id}")
async def get_monte_carlo_simulation_result(job_id: str) -> MonteCarloResponse:
    if job_id not in jobs:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job ID not found"
        )

    result = jobs.get(job_id)
    if result is None:
        return {"job_id": job_id, "status": "running"}
    return {"job_id": job_id, "status": "finished", "result": result}
