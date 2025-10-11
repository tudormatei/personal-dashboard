from fastapi import APIRouter, HTTPException, UploadFile, File, status
from typing import Dict, List, Optional

from ...utils.validation import validate_iso_date, validate_ma_windows
from ...schemas.health import (
    MaintenanceEstimate,
    NutrientStats,
    UploadResponse,
    WeightResponse,
    WorkoutStats,
)
from ...services.health import (
    estimate_maintenance,
    get_macros_stats,
    get_weight_stats,
    get_workout_stats,
    process_health_file,
)

router = APIRouter(prefix="/health")


@router.post("/", status_code=status.HTTP_201_CREATED)
async def upload_health(file: UploadFile = File(...)) -> UploadResponse:
    contents = await file.read()
    if not contents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty",
        )

    return process_health_file(contents)


@router.get("/weight")
def weight_history(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    ma_windows: Optional[str] = "7,30,90",
) -> List[WeightResponse] | None:
    validate_iso_date(start_date, "start_date")
    validate_iso_date(end_date, "end_date")
    validate_ma_windows(ma_windows)

    return get_weight_stats(
        start_date=start_date,
        end_date=end_date,
        ma_windows=ma_windows,
    )


@router.get("/maintenance")
def maintenance_calories(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    min_daily_calories: Optional[float] = 2500,
    calories_ma_window: Optional[int] = 0,
) -> MaintenanceEstimate | None:
    validate_iso_date(start_date, "start_date")
    validate_iso_date(end_date, "end_date")

    if calories_ma_window < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Moving average window cannot be negative",
        )

    return estimate_maintenance(
        start_date=start_date,
        end_date=end_date,
        min_daily_calories=min_daily_calories,
        calories_ma_window=calories_ma_window,
    )


@router.get("/macros")
def macros_history(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    ma_windows: Optional[str] = "7,30,90",
) -> Dict[str, NutrientStats] | None:
    validate_iso_date(start_date, "start_date")
    validate_iso_date(end_date, "end_date")
    validate_ma_windows(ma_windows)

    return get_macros_stats(
        start_date=start_date,
        end_date=end_date,
        ma_windows=ma_windows,
    )


@router.get("/workouts")
def workout_history(
    start_date: Optional[str] = None, end_date: Optional[str] = None
) -> WorkoutStats | None:
    validate_iso_date(start_date, "start_date")
    validate_iso_date(end_date, "end_date")

    return get_workout_stats(
        start_date=start_date,
        end_date=end_date,
    )
