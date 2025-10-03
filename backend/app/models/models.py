from dataclasses import dataclass
from datetime import datetime


@dataclass
class HealthRecord:
    type: str
    date: datetime
    value: float


@dataclass
class WorkoutSession:
    type: str
    start: datetime
    end: datetime
    duration_min: float
