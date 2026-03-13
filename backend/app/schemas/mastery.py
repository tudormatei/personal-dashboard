from datetime import date
from typing import List, Optional

from pydantic import BaseModel, Field


class HistoryEntry(BaseModel):
    date: date
    hours: float


class Milestone(BaseModel):
    label: str
    hours: float
    short_label: Optional[str] = None


class ActivityCreateRequest(BaseModel):
    name: str
    starting_hours: float = Field(default=0, ge=0)
    max_hours: float = Field(default=10000, gt=0)


class LogHoursRequest(BaseModel):
    hours: float = Field(gt=0)
    entry_date: Optional[date] = None


class ActivityStats(BaseModel):
    today_hours: float
    weekly_hours: float
    monthly_hours: float
    streak_days: int
    remaining_hours: float
    progress_pct: int


class NextMilestone(BaseModel):
    label: str
    hours: float
    short_label: Optional[str] = None
    distance_hours: float
    progress_pct: int


class ActivityListItem(BaseModel):
    id: int
    name: str
    max_hours: float
    total_hours: float
    current_level: str
    progress_pct: int


class ActivityResponse(BaseModel):
    id: int
    name: str
    max_hours: float
    total_hours: float
    milestones: List[Milestone]
    history: List[HistoryEntry]
    current_level: str
    next_milestone: Optional[NextMilestone] = None
    stats: ActivityStats
    completed_milestones: List[Milestone]
