from typing import List, Optional

from fastapi import APIRouter, HTTPException, status

from ...schemas.mastery import (
    ActivityCreateRequest,
    ActivityListItem,
    ActivityResponse,
    LogHoursRequest,
)
from ...services.mastery import (
    create_activity,
    get_activity,
    get_activities,
    log_hours,
)

router = APIRouter(prefix="/mastery", tags=["mastery"])


@router.post("/", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
def create_mastery_activity(payload: ActivityCreateRequest) -> ActivityResponse:
    if not payload.name.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Activity name is required",
        )

    if payload.starting_hours < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Starting hours cannot be negative",
        )

    if payload.max_hours <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mastery goal must be greater than 0",
        )

    return create_activity(payload)


@router.get("/", response_model=List[ActivityListItem])
def list_mastery_activities() -> List[ActivityListItem]:
    return get_activities()


@router.get("/{activity_id}", response_model=ActivityResponse)
def get_mastery_activity(activity_id: int) -> ActivityResponse:
    activity = get_activity(activity_id)
    if activity is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found",
        )
    return activity


@router.post("/{activity_id}/log", response_model=ActivityResponse)
def log_activity_hours(
    activity_id: int,
    payload: LogHoursRequest,
) -> ActivityResponse:
    if payload.hours <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Logged hours must be greater than 0",
        )

    activity = log_hours(activity_id=activity_id, payload=payload)
    if activity is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found",
        )

    return activity
