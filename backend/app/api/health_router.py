from fastapi import APIRouter, UploadFile, File, Query
from typing import Optional

from ..services.health_service import estimate_maintenance, get_macros_stats, get_weight_stats, get_workout_stats, process_health_file

router = APIRouter()


@router.post("/health")
async def upload_health(file: UploadFile = File(..., description="Apple Health export XML file")):
    contents = await file.read()
    result = await process_health_file(contents)
    return {"message": f"Imported {result} health records"}


@router.get("/weight")
def weight_history(
    start_date: Optional[str] = Query(None, description="ISO start date"),
    end_date: Optional[str] = Query(None, description="ISO end date"),
    ma_windows: Optional[str] = Query(
        "7,30,90", description="Comma-separated moving average windows"),
    target_weight: Optional[float] = Query(
        None, description="Target weight in kg")
):

    return get_weight_stats(
        start_date=start_date,
        end_date=end_date,
        ma_windows=ma_windows,
        target_weight=target_weight
    )


@router.get("/macros")
def macros_history(
    start_date: Optional[str] = Query(None, description="ISO start date"),
    end_date: Optional[str] = Query(None, description="ISO end date"),
    ma_windows: Optional[str] = Query(
        "7,30,90", description="Comma-separated moving average windows"),
    target_values: Optional[str] = Query(
        None, description="Comma-separated targets per nutrient, e.g. 'calories:2000,protein:100'"),
):

    return get_macros_stats(
        start_date=start_date,
        end_date=end_date,
        ma_windows=ma_windows,
        target_values=target_values
    )


@router.get("/maintenance", summary="Estimate maintenance calories")
def maintenance_calories(
    start_date: Optional[str] = Query(None, description="ISO start date"),
    end_date: Optional[str] = Query(None, description="ISO end date"),
    min_daily_calories: float = Query(
        3000, description="Minimum daily calories to consider a valid day")
):
    return estimate_maintenance(
        start_date=start_date,
        end_date=end_date,
        min_daily_calories=min_daily_calories
    )


@router.get("/workouts")
def weight_history(
    start_date: Optional[str] = Query(None, description="ISO start date"),
    end_date: Optional[str] = Query(None, description="ISO end date"),
):
    return get_workout_stats(
        start_date=start_date,
        end_date=end_date,
    )
